import Link from '../Link/Link';
import Button from '../Button/Button';
import Input from '../Input/Input';

import template from './MainSearch.hbs';
import Base from '../Base/Base'

/**
* Класс MainSearch представляет основное поле поиска, которое может быть отрендерено в HTML.
* @class
*/
class MainSearch extends Base {

  /**
  * Рендерит основное поле поиска в DOM, включая ссылки и поле ввода.
  */
  async render() {
    const searchBlock = document.getElementById('main-search');
    const htmlView = await this.asHTML()

    searchBlock?.insertAdjacentHTML('beforeend', htmlView);

    const linkArea = document.getElementById('search-links') as HTMLElement;
    new Link(linkArea,  { className: 'search-link', src: '../static/restaurant.svg', label: 'Рестораны'}).render();
    new Link(linkArea, { className: 'search-link', src: '../static/hotel.svg', label: 'Отели'}).render();
    new Link(linkArea, { className: 'search-link', src: '../static/attraction.svg', label: 'Развлечения'}).render();

    const searchbarArea = document.getElementById('form-search') as HTMLElement;
    new Input(searchbarArea, {
      id: 'searchbar',
      img: '../static/search.svg',
      type: 'text',
      placeholder: 'Всё, что душе угодно...',
    }).render();
    const searchbarDiv = document.getElementById('searchbar') as HTMLElement;
    new Button(searchbarDiv , { type: 'submit', label: 'Поиск' }).render();
  }
}

export default MainSearch;
