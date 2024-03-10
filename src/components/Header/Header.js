import Button from '../Button/Button';
import Logo from './Logo/Logo';
import Link from './Link/Link';
import urls from '../../router/urls';
import { router } from '../../router/Router';

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
    return template(this);
  }

  /**
  * Рендерит блок ссылок в DOM.
  * @param {HTMLElement} parent - Родительский элемент, в который будут вставлены ссылки.
  * @param {Array<string>} labels - Массив меток для ссылок.
  */
  renderLinkBlock(parent, labels) {
    labels.forEach((label) => new Link(parent, { label: label, className: 'search-link' }).render());
  }

  /**
  * Рендерит шапку, включая логотип, ссылки и кнопки в зависимости от состояния пользователя.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());

    const logoGroup = document.getElementById('logo-group');
    const logo = new Logo(logoGroup);
    logo.render();

    const linkBlock = document.getElementById('links');
    this.renderLinkBlock(linkBlock, ['Альбомы', 'Отзывы', 'Поддержка']);

    // const buttonGroup = document.getElementById('button-group');
    // new Button(buttonGroup,{id:'button-region',img:'../../static/globe.svg'}).render();

    const profileBlock = document.getElementById('button-group');

    const username = localStorage.getItem('username');

    if (username != null) {
      new Link(profileBlock, { className: 'user-link', label: username }).render();
      new Button(profileBlock, { id: 'logout', label: 'Выйти' }).render();

      const logout = document.getElementById('logout');

      logout.addEventListener('click', () => {
        localStorage.removeItem('username');
        router.go(urls.base);
      });
    } else {
      new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти' }).render();
      const loginButton = document.getElementById('button-login');
      loginButton.addEventListener('click', () => {
        router.go(urls.login);
      });
    }
  }
}

export default Header;