import Header from '../../components/Header/Header';
import MainSearch from '../../components/MainSearch/MainSearch';
import Placelist from './Placelist/Placelist';
import Base from '../../components/Base/Base'

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
    await this.preRender();
 
    const header = document.getElementById('header') as HTMLElement;
    const mainsearch = document.getElementById('main-search') as HTMLElement;
    const places = document.getElementById('places') as HTMLElement;

    await new Header(header).render();
    await new MainSearch(mainsearch).render();
    await new Placelist(places).render();
  }
}

export default PlacesPage;
