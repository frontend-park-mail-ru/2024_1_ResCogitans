import Link from '@components/Link/Link';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Base from '@components/Base/Base';
import template from '@templates/MainSearch.hbs';


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
    const categories = [
      {
        label: 'Все места', category: 0, id: 'all-places',
      },
      {
        label: 'Рестораны', category: 1, id: 'restaurants',
      },
      {
        label: 'Отели', category: 2, id: 'hotels',
      },
      {
        label: 'Развлечения', category: 3, id: 'entertainments',
      },
    ];

    categories.forEach(category => {
      const link = new Link(linkArea, {
        className: 'underlined-link',
        label: category.label,
        id: category.id,
      });
      link.render();
      document.querySelector(`#${category.id}`)?.addEventListener('click', () => this.categoryChangeCallback(category.category));
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
