import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Sight } from 'src/types/api';
import Place from '@pages/PlacesPage/Placelist/Place/Place';
import { get, post } from '@api/base';
import { router } from '@router/router';

class JourneyPage extends Base {

  parent : HTMLElement;

  sights : Sight[];

  IDs : number[];

  tripID : number;

  constructor(parent : HTMLElement) {
    super(parent);
    this.IDs = [];
  }


  async render() {
    await this.preRender(); 

    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();

    const placelist = document.querySelector('#list-places') as HTMLDivElement;
    const sightResponse = await get('sights');
    sightResponse.data.sights.sort((a, b) => {
      const A = a.name.toUpperCase();
      const B = b.name.toUpperCase();
      if (A < B) {return -1;}
      if (A > B) {return 1;}
      return 0;
    });
    this.sights = sightResponse.data.sights;
    const sightSelect = document.querySelector('select') as HTMLSelectElement;

    this.sights.forEach((data) => {
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
         
      const sightSelected = this.sights.find(entry => entry.id === parseInt(selectedOption.value));
      if (sightSelected) {
        this.IDs.push(parseInt(selectedOption.value));
        new Place(placelist, sightSelected).render();
      }
    });
        
    const submitButton = document.getElementById('button-submit') as HTMLButtonElement;
    submitButton.addEventListener('click', (e : Event) => {
      e.preventDefault();
      const userID = parseInt(localStorage.getItem('userID'));
      if (userID === null) {
        router.go('login');
      }

      const nameInput = document.querySelector('input') as HTMLInputElement;
      const descriptionInput = document.querySelector('textarea') as HTMLTextAreaElement; 
      const body = { userID : userID, name : nameInput.value, description : descriptionInput.value };

      post('trip/create', body).then((response) => {
        if (response.status === 200) {
          // this.tripID = response.data.tripID; 
          this.tripID = 2;
          this.IDs.map((sightID) => {
            return post(`trip/${this.tripID}/sight/add`, { sightID : sightID });
          });
        }
      });
    });
  }
}

export default JourneyPage;
