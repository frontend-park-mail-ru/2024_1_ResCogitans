import Header from '@components/Header/Header';
import MainSearch from '@components/MainSearch/MainSearch';
import Placelist from './Placelist/Placelist';
import Base from '@components/Base/Base';
import template from '@templates/PlacesPage.hbs';


/**
* Класс PlacesPage представляет страницу мест, которая может быть отрендерена в HTML.
* @class
*/
class PlacesPage extends Base {
  /**
  * Рендерит страницу мест в DOM, включая шапку сайта, основное поле поиска и список мест.
  */
  constructor(parent: HTMLElement) {
    super(parent, template); 
  }
  
  render() {
    this.preRender();
    document.body.style.backgroundImage = '';
 
    const header = document.getElementById('header') as HTMLElement;
    const mainsearch = document.getElementById('main-search') as HTMLElement;
    const places = document.getElementById('places') as HTMLElement;
    document.body.classList.remove('auth-background');

    new Header(header).render();
  
    const placelist = new Placelist(places);
    const mainSearchInstance = new MainSearch(mainsearch, placelist.filterByCategory, placelist.filterByName);
    placelist.render();
    mainSearchInstance.render();
  }
}

export default PlacesPage;
