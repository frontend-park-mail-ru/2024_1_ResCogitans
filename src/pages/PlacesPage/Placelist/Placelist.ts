import Place from './Place/Place';
import { get } from '@api/base';
import Base from '@components/Base/Base';
import { Sights, WithResponse } from 'src/types/api';

/**
 * 
 * 
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist extends Base {
  async render() {
    await this.preRender();

    const response = await get('sights') as WithResponse<Sights>;

    const placelist = document.getElementById('list-places') as HTMLDivElement;
    response.data.sights.forEach((data) => new Place(placelist, data).render());
  }
}

export default Placelist;
