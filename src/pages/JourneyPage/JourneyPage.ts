import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Journey, Sight, JourneyResponse } from 'src/types/api';
import Place from '@pages/PlacesPage/Placelist/Place/Place';
import { get, post } from '@api/base';
import { router } from '@router/router';
import urls from '@router/urls';
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

    if (arguments[1].length > 2) {
      router.go('404');
    }

    if (arguments[1][0] === 'edit' || arguments[1][0] === 'new') {
      this.type = arguments[1][0];
      this.tripID = arguments[1][1];
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.tripID = arguments[1][0];
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
        const form = document.querySelector('form') as HTMLFormElement; 
            
        form.addEventListener('submit', (e : Event) => {
          e.preventDefault();

          if (this.IDs.length === 0) { 
            const authForm = new AuthorizationForm(form);
            authForm.renderError(form, 'Выберите места для поездки');
            return;
          } 

          const userID = this.userData.userID;          
          const nameInput = document.querySelector('input') as HTMLInputElement;
          const descriptionInput = document.querySelector('textarea') as HTMLTextAreaElement; 
          const body = { userID : userID, name : nameInput.value, description : descriptionInput.value };
       
          post('trip/create', body).then((response) => {
            if (response.status === 200) {
              this.tripID = response.data.id;
              post(`trip/${this.tripID}/sight/add`, { sightIDs : this.IDs }).then(() => {
                this.type = 'view';
                router.go(`journey/${this.tripID}`);
              });
            } else {
              router.go('login');
            }
          });
        });
        break;
      case 'view':
      case 'edit':
        
        const journeyResponse = await get(`trip/${this.tripID}`) as JourneyResponse;
        this.isOwn = true;

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
            post(`trip/${this.tripID}/delete`, {}).then(() => {
              deleteDialog.close();
              router.go(urls.base);
            });
          });
  
          if (this.type === 'view') {
            editJourneyButton?.addEventListener('click', () => {
              router.go(`journey/edit/${this.tripID}`);
            });
          } else if (this.type === 'edit') {
            editForm.addEventListener('submit', (e : Event) => {
              const userID = this.userData.userID;          
              const nameInput = document.querySelector('input') as HTMLInputElement;
              const descriptionInput = document.querySelector('textarea') as HTMLTextAreaElement; 
              const body = { userID : userID, name : nameInput.value, description : descriptionInput.value, sightIDs : this.IDs };

              e.preventDefault();
              post(`trip/${this.tripID}/sight/add`, body).then(() => {
                this.type = 'view';
                router.go(`journey/${this.tripID}`);
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
