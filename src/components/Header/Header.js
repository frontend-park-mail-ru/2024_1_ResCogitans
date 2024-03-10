import Button from '../Button/Button';
import Logo from './Logo/Logo';
import Link from './Link/Link';
import PlacesPage from '../../pages/PlacesPage/PlacesPage'
import urls from '../../router/urls'
import { router } from '../../router/Router'

import template from './Header.hbs';

const user = false;

/**
* Класс Header. Это шапка сайта.
* @class
*/
class Header {
  /**
  * Создает новый экземпляр шапки сайта.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена шапка сайта.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление шапки сайта.
  * @returns {string} HTML-представление шапки сайта.
  */
  asHTML() {
    return template();
  }

  /**
  * Рендерит блок ссылок в DOM.
  * @param {HTMLElement} parent - Родительский элемент, в который будут вставлены ссылки.
  * @param {Array<string>} labels - Массив меток для ссылок.
  */
  renderLinkBlock(parent, labels) {
    labels.forEach((label) => new Link(parent, { label }).render());
  }


  /**
  * Рендерит шапку сайта в DOM, включая логотип, ссылки и кнопки в зависимости от состояния пользователя.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    
    const logoGroup = document.getElementById('logo-group');
    const logo = new Logo(logoGroup);
    logo.render();

    const linkBlock = document.getElementById('links');
    this.renderLinkBlock(linkBlock, ['Альбомы', 'Отзывы', 'Поддержка']);

    const buttonGroup = document.getElementById('button-group');
    // const currencyButton = new Button(buttonGroup, { id: 'button-region', img: '../../static/globe.svg' });
    // currencyButton.render();

    const profileBlock = document.getElementById('button-group');

    const username = localStorage.getItem('username');

    if (username != null) {
      const profile = new Link(profileBlock, {className: 'user-link', label : username}).render()
      const logout = new Button(profileBlock, {id: 'logout', label: 'Выйти'}).render();

      logout.addEventListener('click', (e) => {
          localStorage.removeItem('username')
          router.go(urls.sights);
      })
    } else {
      const loginButton = new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти' });
      loginButton.render();
      let state = 0;
      document.getElementById('button-login').addEventListener('click', () => {
        router.go(urls.login);
      })
    }
  }
}

export default Header;
