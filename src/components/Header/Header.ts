import Button from '../Button/Button';
import Logo from './Logo/Logo';
import Link from '../Link/Link';
import urls from '../../router/urls';
import  { router } from '../../router/router';
import { userHelper } from '../../utils/localstorage';
import { logout } from '../../api/user';
import Base from '../Base/Base';
import template from './Header.hbs'

/**
* Класс Header. Это шапка сайта.
* @class
*/
class Header extends Base {
  /**
  * Рендерит блок ссылок в DOM.
  * @param {HTMLElement} parent - Родительский элемент, в который будут вставлены ссылки.
  * @param {Array<string>} labels - Массив меток для ссылок.
  */
  renderLinkBlock(parent : HTMLElement, labels : Array<string>) {
    labels.forEach((label) => new Link(parent, { label, className: 'search-link' }).render());
  }

  /**
  * Рендерит шапку, включая логотип, ссылки и кнопки в зависимости от состояния пользователя.
  */
  async render() {
      const htmlView = this.template(this);
        this.parent.insertAdjacentHTML('beforeend', htmlView);

    const logoGroup = document.getElementById('logo-group') as HTMLElement;
    const logo = new Logo(logoGroup);
    logo.render();

    const linkBlock = document.getElementById('links') as HTMLElement;
    this.renderLinkBlock(linkBlock, ['Альбомы', 'Отзывы', 'Поддержка']);

    const profileBlock = document.getElementById('button-group') as HTMLElement;

    const username = localStorage.getItem('username');

    if (username != null) {
      new Link(profileBlock, { className: 'user-link', label: username }).render();
      new Button(profileBlock, { id: 'logout', label: 'Выйти' }).render();

      const logoutButton = document.getElementById('logout') as HTMLElement;

      logoutButton.addEventListener('click', () => {
        if (process.env.API_URL !== undefined) {
          logout(process.env.API_URL);
          userHelper('remove');
          router.go(urls.base);
        }
      });
    } else {
      new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти' }).render();
      const loginButton = document.getElementById('button-login') as HTMLElement;
      loginButton.addEventListener('click', () => {
        router.go(urls.login);
      });
    }
  }
}

export default Header;
