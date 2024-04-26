import Place from './Place/Place';
import { get } from '@api/base';
import Base from '@components/Base/Base';
import { Sight } from 'src/types/api';
import template from '@templates/Placelist.hbs';


/**
 * 
 * 
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist extends Base {

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  renderPlaces(sights: Sight[]) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    sights.forEach((data) => new Place(placelist, data).render());
  }
    
  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  render() {
    this.preRender();
    

    const response = await get('sights') as WithResponse<Sights>;

    const placelist = document.getElementById('list-places') as HTMLDivElement;
    response.data.sights.forEach((data) => new Place(placelist, data).render());
  }
}

export default Placelist;
