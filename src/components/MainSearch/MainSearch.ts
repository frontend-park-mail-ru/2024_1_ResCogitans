import Link from '@components/Link/Link';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Base from '@components/Base/Base';

/**
* Класс MainSearch представляет основное поле поиска, которое может быть отрендерено в HTML.
* @class
*/
class MainSearch extends Base {

  /**
  * Рендерит основное поле поиска в DOM, включая ссылки и поле ввода.
  */
  async render() {
    const searchBlock = document.getElementById('main-search') as HTMLElement;
    await this.preRender(searchBlock);

    const linkArea = document.getElementById('search-links') as HTMLElement;
    new Link(linkArea,  { className: 'search-link', src: 'static/restaurant.svg', label: 'Рестораны' }).render();
    new Link(linkArea, { className: 'search-link', src: 'static/hotel.svg', label: 'Отели' }).render();
    new Link(linkArea, { className: 'search-link', src: 'static/attraction.svg', label: 'Развлечения' }).render();

    const searchbarArea = document.getElementById('form-search') as HTMLElement;
    await new Input(searchbarArea, {
      id: 'searchbar',
      img: 'static/search.svg',
      type: 'text',
      placeholder: 'Всё, что душе угодно...',
    }).render();
    const searchbarDiv = document.getElementById('searchbar') as HTMLElement;
    await new Button(searchbarDiv, { type: 'submit', label: 'Поиск' }).render();
  }
}

export default MainSearch;
