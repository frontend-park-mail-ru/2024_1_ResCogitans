import Place from './Place/Place';
import Base from '@components/Base/Base';
import { Sights, Sight } from 'src/types/api';
import template from '@templates/Placelist.hbs';
import { WithResponse } from 'src/types/api';
import { getSights } from '@api/sight';


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

  renderPlaces(sights: Sights) {
    const placelist = document.getElementById('list-places') as HTMLDivElement;
    sights.forEach((data) => new Place(placelist, data).render());
  }
    
  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  render() {
    this.preRender();
    (async () => {
      const response = await getSights() as WithResponse<Sights>;

      const placelist = document.getElementById('list-places') as HTMLDivElement;
      response.data.sights.forEach((data) => new Place(placelist, data).render());
    })();
  }

  filterByCategory(category: number) {
    getSights(category).then((sightResponse) => {
      const placelist = document.getElementById('list-places') as HTMLDivElement;
      placelist.innerHTML = '';
      sightResponse.data.sights.forEach((data) => new Place(placelist, data).render());
    });
  }
}

export default Placelist;
