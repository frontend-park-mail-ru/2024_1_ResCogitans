import Link from '../Header/Link/Link';
import Button from '../Button/Button';
import Input from '../Input/Input';

import template from './MainSearch.hbs';

/**
* Класс MainSearch представляет основное поле поиска, которое может быть отрендерено в HTML.
* @class
*/
class MainSearch {
  /**
  * Создает новый экземпляр основного поля поиска.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлено поле поиска.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление основного поля поиска.
  * @returns {string} HTML-представление основного поля поиска.
  */
  asHTML() {
    return template();
  }

  /**
  * Рендерит основное поле поиска в DOM, включая ссылки и поле ввода.
  */
  render() {
    const searchBlock = document.getElementById('main-search');
    searchBlock.insertAdjacentHTML('beforeend', this.asHTML());

    const linkArea = document.getElementById('search-links');
    new Link(linkArea, { class: 'search-link', src: '../static/restaurant.svg', label: 'Рестораны' }).render();
    new Link(linkArea, { class: 'search-link', src: '../static/hotel.svg', label: 'Отели' }).render();
    new Link(linkArea, { class: 'search-link', src: '../static/attraction.svg', label: 'Развлечения' }).render();

    const searchbarArea = document.getElementById('form-search');
    new Input(searchbarArea, {
      id: 'searchbar',
      img: '../static/search.svg',
      type: 'text',
      placeholder: 'Всё, что душе угодно...',
    }).render();
    const searchbarDiv = document.getElementById('searchbar');
    new Button(searchbarDiv, { type: 'submit', label: 'Поиск' }).render();
  }
}

export default MainSearch;
