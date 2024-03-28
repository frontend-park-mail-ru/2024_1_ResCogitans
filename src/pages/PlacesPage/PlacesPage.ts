import Header from '../../components/Header/Header';
import MainSearch from '../../components/MainSearch/MainSearch';
import Placelist from './Placelist/Placelist';
import Base from '../../components/Base/Base'
import template from './PlacesPage.hbs'

/**
* Класс PlacesPage представляет страницу мест, которая может быть отрендерена в HTML.
* @class
*/
class PlacesPage extends Base {
  /**
  * Рендерит страницу мест в DOM, включая шапку сайта, основное поле поиска и список мест.
  */
  async render() {
    document.body.style.backgroundImage = '';
    const htmlView = this.template(this);
    this.parent.insertAdjacentHTML('beforeend', htmlView);
 
    const header = document.getElementById('header') as HTMLElement;
    const mainsearch = document.getElementById('main-search') as HTMLElement;

    new Header(header).render();
    new MainSearch(mainsearch).render();
    new Placelist(mainsearch).render();
  }
}

export default PlacesPage;
