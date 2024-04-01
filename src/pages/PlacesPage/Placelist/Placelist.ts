import Place from './Place/Place'
import get from '@api/base';
import Base from '@components/Base/Base'
import { Sight } from 'src/types/api';

/**
 * 
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist extends Base {

  async renderPlaces(places : Array<Sight>) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    console.log(places);
    const placePromises = places.map((data) => new Place(placelist, data).render());
  }
    

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  async render() {
    await this.preRender();

    get("sights")
      .then((responsePlaces) => this.renderPlaces(responsePlaces));
  }
}

export default Placelist;
