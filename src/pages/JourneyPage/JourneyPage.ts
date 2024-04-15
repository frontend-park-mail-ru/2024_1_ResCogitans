import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Journey, Sight, JourneyResponse } from 'src/types/api';
import Place from '@pages/PlacesPage/Placelist/Place/Place';
import { get, post } from '@api/base';
import { router } from '@router/router';
import urls from '@router/urls';
import { ROUTES } from '@router/ROUTES';

import AuthorizationForm from '@components/Form/AuthorizationForm';

class JourneyPage extends Base {

  parent : HTMLElement;

  IDs : number[];

  tripID? : string;

  journey : Journey;

  isOwn : boolean;

  isEdit : boolean;

  type? : string;

  isAuthorized : boolean;

  constructor(parent : HTMLElement) {

    super(parent);
    this.IDs = [];
    this.isOwn = false;
    this.isAuthorized = arguments[2];

    const pathParams = arguments[1];
    const journeyType = pathParams[1];

    if (pathParams.length > 2) {
      router.go('404');
    }

    if (journeyType === 'edit' || pathParams[0] === 'new') {
      this.type = journeyType === 'edit' ? this.type = 'edit' : this.type = 'new';
      this.tripID = pathParams[0];
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.tripID = pathParams[0];
      this.type = 'view';
    }
  }

  async addSightsToOptions() {
    if (this.isEdit === false) {
      return;
    }  
    const placelist = document.querySelector('#list-places') as HTMLDivElement;
    const sightResponse = await get('sights');

    sightResponse.data.sights.sort((a : Sight, b : Sight) => {
      const A = a.name.toUpperCase();
      const B = b.name.toUpperCase();
      if (A < B) {return -1;}
      if (A > B) {return 1;}
      return 0;
    });

    let sights = sightResponse.data.sights;
    const sightSelect = document.querySelector('select') as HTMLSelectElement;

    sights.forEach((data) => {
      const option = document.createElement('option');
      option.value = String(data.id);
      option.text = data.name;
      sightSelect?.appendChild(option);
    });

    sightSelect.addEventListener('change', () => {
      const activeCards = document.querySelectorAll('.card');
      if (sightSelect.selectedIndex === -1) {
        activeCards.item(activeCards.length - 1).remove();
        this.IDs.pop();
        return;
      }
      const selectedOption = sightSelect.options[sightSelect.selectedIndex];
      if (selectedOption !== undefined) {
        const sightCard = document.getElementById(`card-${selectedOption.value}`) as HTMLDivElement || null;
        if (sightCard !== null) {
          sightCard.remove();
          this.IDs = this.IDs.filter(item => item !== parseInt(selectedOption.value));
          return;
        }
      } 
        
      const sightSelected = sights.find(entry => entry.id === parseInt(selectedOption.value));
      if (sightSelected) {
        this.IDs.push(parseInt(selectedOption.value));
        new Place(placelist, sightSelected).render();
      }
    });
  }

  async render() {

    if (this.type === null) {
      this.type = 'new';
    }

    document.body.classList.remove('auth-background');
    let journeyInfoDiv, title, header;

    switch (this.type) {
      case 'new':

        if (this.userData.userID === undefined) {
          router.go('login');
        }

        await this.preRender(); 

        header = document.getElementById('header') as HTMLElement;
        await new Header(header).render();

        journeyInfoDiv = document.getElementById('journey-info');
        title = document.createElement('h1');
        title.textContent = 'Создание поездки';
        journeyInfoDiv?.insertAdjacentElement('afterbegin', title);
     
    
        this.addSightsToOptions();
          
        const submitButton = document.getElementById('button-submit') as HTMLButtonElement;
        submitButton.textContent = 'Создать';
        document.getElementById('button-delete-journey')?.remove();
        let form = document.querySelector('form') as HTMLFormElement; 
            
        form.addEventListener('submit', (e : Event) => {
          e.preventDefault();

          const errorDisplay = new AuthorizationForm(this.parent);
          errorDisplay.clearError(form);

          if (this.IDs.length === 0) { 
            errorDisplay.renderError(form, 'Выберите места для поездки');
            return;
          } 

          const userID = this.userData.userID;          
          const nameInput = document.querySelector('input') as HTMLInputElement;
          const descriptionInput = document.querySelector('textarea') as HTMLTextAreaElement; 
          const body = { userID : userID, name : nameInput.value, description : descriptionInput.value };
       
          post(ROUTES.journey.create, body).then((response) => {
            if (response.status === 200) {
              this.tripID = response.data.id;
              post(ROUTES.journey.editsight(this.tripID), { sightIDs : this.IDs }).then(() => {
                this.type = 'view';
                router.go(ROUTES.journey.view(this.tripID));
              });
            } else {
              if (response.status === 500) {
                errorDisplay.renderError(form, 'Поездка с таким именем уже есть');
                return;
              } else {
                router.go('login');
              }
            }
          });
        });
        break;
      case 'view':
      case 'edit':
        
        const journeyResponse = await get(`trip/${this.tripID}`) as JourneyResponse;
        this.isOwn = (this.userData !== null && this.userData.userID === journeyResponse.data.journey.userID);

        if (journeyResponse.status === 200 && journeyResponse.data.sights !== null) {
          journeyResponse.data.sights.map((sight) => this.IDs.push(sight.id));
          this.journey = journeyResponse.data.journey;
            
          await this.preRender();
            
          header = document.getElementById('header') as HTMLElement;
         
          await new Header(header).render();
  
          journeyInfoDiv = document.getElementById('journey-info');
          title = document.createElement('h1');
          title.textContent = `${this.journey.name}`;
          journeyInfoDiv?.insertAdjacentElement('afterbegin', title);

          this.addSightsToOptions();

          const placelist = document.querySelector('#list-places') as HTMLDivElement;
          journeyResponse.data.sights.forEach((sight) =>  new Place(placelist, sight).render());
  
          const editForm = document.querySelector('form') as HTMLFormElement;
          const editJourneyButton = document.getElementById('button-edit-journey');
          const deleteJourneyButton = document.getElementById('button-delete-journey');

          const deleteDialog = document.querySelector('.delete-dialog') as HTMLDialogElement;
      
          const deleteModalButton = deleteDialog.querySelector('#button-delete') as HTMLButtonElement;
        
          deleteJourneyButton?.addEventListener('click', () => {
            deleteDialog.showModal();
          });

          deleteModalButton?.addEventListener('click', () => {
            post(ROUTES.journey.delete(this.tripID), {}).then(() => {
              deleteDialog.close();
              router.go(urls.base);
            });
          });
  
          if (this.type === 'view') {
            editJourneyButton?.addEventListener('click', () => {
              router.go(ROUTES.journey.edit(this.tripID));
            });
          } else if (this.type === 'edit') {
            editForm.addEventListener('submit', (e : Event) => {

              form = document.querySelector('form') as HTMLFormElement; 

              e.preventDefault();

              if (this.IDs.length === 0) { 
                new AuthorizationForm(this.parent).renderError(form, 'Выберите места для поездки');
                return;
              } 

              const userID = this.userData.userID;          
              const nameInput = document.querySelector('input') as HTMLInputElement;
              const descriptionInput = document.querySelector('textarea') as HTMLTextAreaElement; 
              const body = { userID : userID, name : nameInput.value, description : descriptionInput.value, sightIDs : this.IDs };

              post(ROUTES.journey.editsight(this.tripID), body).then((createJourneyResponse) => {
                if (createJourneyResponse.status === 500) {
                  new AuthorizationForm(this.parent).renderError(form, 'Поездка с таким именем уже есть');
                  return;
                }
                this.type = 'view';
                router.go(ROUTES.journey.view(this.tripID));
              });
            });
          }
          break;
        } else {
          router.go('404');
        }
    }
  } 
}

export default JourneyPage;
