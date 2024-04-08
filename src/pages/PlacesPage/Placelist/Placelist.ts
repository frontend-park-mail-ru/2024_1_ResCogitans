import Place from './Place/Place';
import { get } from '@api/base';
import Base from '@components/Base/Base';
import { Sight } from 'src/types/api';

/**
 * 
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist extends Base {

  async renderPlaces(sights: Sight[]) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    sights.forEach((data) => new Place(placelist, data).render());
  }
    

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  async render() {
    await this.preRender();

    get('sights')
      .then((response) => this.renderPlaces(response.data.sights));
  }
}

export default Placelist;
