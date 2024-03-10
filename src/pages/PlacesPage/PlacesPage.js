import Header from '../../components/Header/Header';
import MainSearch from '../../components/MainSearch/MainSearch';
import Placelist from './Placelist/Placelist';

import template from './PlacesPage.hbs';

/**
* Класс PlacesPage представляет страницу мест, которая может быть отрендерена в HTML.
* @class
*/
class PlacesPage {
  /**
  * Создает новый экземпляр страницы мест.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена страница мест.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление страницы мест.
  * @returns {string} HTML-представление страницы мест.
  */
  asHTML() {
    return template();
  }

  /**
  * Рендерит страницу мест в DOM, включая шапку сайта, основное поле поиска и список мест.
  */
  render() {
    document.body.style.backgroundImage = '';
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());

    const header = document.getElementById('header');
    const mainsearch = document.getElementById('main-search');

    new Header(header).render();
    new MainSearch(mainsearch).render();
    new Placelist(mainsearch).render();
  }
}

export default PlacesPage;
