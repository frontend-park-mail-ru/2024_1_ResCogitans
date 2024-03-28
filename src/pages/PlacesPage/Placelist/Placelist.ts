import Place from './Place/Place'
import get from '../../../api/base';
import Base from '../../../components/Base/Base'
import template from './Placelist.hbs'

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

  renderPlaces(places : SightResponse) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    places.sights.forEach((data) => new Place(placelist, data).render());
  }

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  async render() {
    const htmlView = this.template(this);
    this.parent.insertAdjacentHTML('afterend', htmlView);
    get(`${process.env.API_URL}/sights`)
      .then((responsePlaces) => this.renderPlaces(responsePlaces));
  }
}

export default Placelist;
