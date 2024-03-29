import Place from './Place/Place'
import get from '../../../api/base';
import Base from '../../../components/Base/Base'

interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
  url: string
}

interface SightResponse {
  sights: Sight[];
 }

/**
 * 
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist extends Base {

  async renderPlaces(places : SightResponse) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    const placePromises = places.sights.map((data) => new Place(placelist, data).render());
  }
    

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  async render() {
    await this.preRender();

    get(`${process.env.API_URL}/sights`)
      .then((responsePlaces) => this.renderPlaces(responsePlaces));
  }
}

export default Placelist;
