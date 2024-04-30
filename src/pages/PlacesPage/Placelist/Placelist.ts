import Place from './Place/Place';
import Base from '@components/Base/Base';
import { Sights, Sight } from 'src/types/api';
import template from '@templates/Placelist.hbs';
import { WithResponse } from 'src/types/api';
import { getSights, filterSights } from '@api/sight';


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
    if (category === 0) {
      getSights().then((sightResponse) => {
        const placelist = document.getElementById('list-places') as HTMLDivElement;
        placelist.innerHTML = '';
        sightResponse.data.sights.forEach((data) => new Place(placelist, data).render());
      });
    } else {
      filterSights({
        'category_id': category,
      }).then((sightResponse) => {
        const placelist = document.getElementById('list-places') as HTMLDivElement;
        placelist.innerHTML = '';
        sightResponse.data.sights.forEach((data) => new Place(placelist, data).render());
      }); 
    }
  }

  filterByName(name: string) {
    filterSights({
      'name': name,
    }).then((sightResponse) => {
      const placelist = document.getElementById('list-places') as HTMLDivElement;
      placelist.innerHTML = '';
      sightResponse.data.sights.forEach((data) => new Place(placelist, data).render());
    });
  }
}

export default Placelist;
