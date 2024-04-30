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

  constructor(parent: HTMLElement, categoryChangeCallback: (category: number) => void) {
    super(parent, template);
    this.categoryChangeCallback = categoryChangeCallback;
  }

  categoryChangeCallback: (category: number) => void;

  /**
  * Рендерит основное поле поиска в DOM, включая ссылки и поле ввода.
  */
  render() {
    const searchBlock = document.getElementById('main-search') as HTMLElement;
    this.preRender(searchBlock);
   
    const linkArea = document.getElementById('underlined-links') as HTMLElement;
    getCategories().then((categoryResponse) => {
      const categories = categoryResponse.data.categories.concat([{
        name: 'Все места', id: 0,
      }]);
      categories.forEach(category => {
        const link = new Link(linkArea, {
          className: 'underlined-link',
          label: category.name,
          id: `category-${category.id}`,
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
      type: 'submit', label: 'Поиск', 
    }).render();
  }
}

export default MainSearch;
