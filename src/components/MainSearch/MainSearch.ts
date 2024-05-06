import Link from '@components/Link/Link';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Base from '@components/Base/Base';
import template from '@templates/MainSearch.hbs';
import { getCategories } from '@api/sight';


/**
* Класс MainSearch представляет основное поле поиска, которое может быть отрендерено в HTML.
* @class
*/
class MainSearch extends Base {

  constructor(parent: HTMLElement, categoryChangeCallback: (category: number) => void, searchChangeCallback: (name: string) => void) {
    super(parent, template);
    this.categoryChangeCallback = categoryChangeCallback;
    this.searchChangeCallback = searchChangeCallback;
  }

  categoryChangeCallback: (category: number) => void;

  searchChangeCallback: (name: string) => void;

  /**
  * Рендерит основное поле поиска в DOM, включая ссылки и поле ввода.
  */
  render() {
    const searchBlock = document.getElementById('main-search') as HTMLElement;
    this.preRender(searchBlock);
   
    const linkArea = document.getElementById('underlined-links') as HTMLElement;
    const icons : { [key : number] : string } = {
      0 : 'static/restaurant.svg', 1 : 'static/hotel.svg', 2 : 'static/attraction.svg', 3 : 'static/globe.svg',
    };
    getCategories().then((categoryResponse) => {
      const categories = categoryResponse.data.categories.concat([{
        name: 'Все места', id: 0,
      }]);
      categories.forEach((category, index) => {
        const link = new Link(linkArea, {
          className: 'underlined-link',
          label: category.name,
          id: `category-${category.id}`,
          src: icons[index],
        });
        link.render();
        document.querySelector(`#category-${category.id}`)?.addEventListener('click', () => this.categoryChangeCallback(category.id));
      });
    });
    
    const searchbarArea = document.getElementById('form-search') as HTMLElement;
    new Input(searchbarArea, {
      id: 'searchbar',
      img: 'static/search.svg',
      type: 'text',
      placeholder: 'Всё, что душе угодно...',
    }).render();
    const searchbarDiv = document.getElementById('searchbar') as HTMLElement;
    new Button(searchbarDiv, {
      label: 'Поиск', id: 'main-search-button',
    }).render();

    const inputElement = searchbarDiv.querySelector('input');
    inputElement?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.searchChangeCallback(inputElement.value);
      }
    });
    
    document.querySelector('#main-search-button')?.addEventListener('click', (event) => {
      event.preventDefault();
      this.searchChangeCallback(inputElement.value);
    });
  }
}

export default MainSearch;
