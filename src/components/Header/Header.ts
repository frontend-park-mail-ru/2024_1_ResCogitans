import Button from '@components/Button/Button';
import Logo from '@components/Logo/Logo';
import Link from '@components/Link/Link';
import urls from '@router/urls';
import  { router } from '@router/router';
import { authorize } from '@api/user';
import Base from '@components/Base/Base';

/**
* Класс Header. Это шапка сайта.
* @class
*/
class Header extends Base {
class Header extends Base {
  /**
  * Рендерит блок ссылок в DOM.
  * @param {HTMLElement} parent - Родительский элемент, в который будут вставлены ссылки.
  * @param {Array<string>} labels - Массив меток для ссылок.
  */
  renderLinkBlock(parent : HTMLElement, labels : Array<string>) {
  renderLinkBlock(parent : HTMLElement, labels : Array<string>) {
    labels.forEach((label) => new Link(parent, { label, className: 'search-link' }).render());
  }

  /**
  * Рендерит шапку, включая логотип, ссылки и кнопки в зависимости от состояния пользователя.
  */
  async render() {
    await this.preRender();
  async render() {
    await this.preRender();

    const logoGroup = document.getElementById('logo-group') as HTMLElement;
    const logoGroup = document.getElementById('logo-group') as HTMLElement;
    const logo = new Logo(logoGroup);
    logo.render();

    const profileBlock = document.getElementById('button-group') as HTMLElement;

    const username = localStorage.getItem('username');
    const userID = localStorage.getItem('userID');
    // backend request to check validation and not local storage 

    if (username !== null) {
      await new Link(profileBlock, { className: 'user-link', label: username, url : `/profile/${userID}` }).render();
      await new Button(profileBlock, { id: 'logout', label: 'Выйти' }).render();

      const logoutButton = document.getElementById('logout') as HTMLElement;
      const logoutButton = document.getElementById('logout') as HTMLElement;

      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        authorize('logout');
        router.go(urls.base);
      });
    } else {
      await new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти' }).render();
      const loginButton = document.getElementById('button-login') as HTMLElement;
      await new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти' }).render();
      const loginButton = document.getElementById('button-login') as HTMLElement;
      loginButton.addEventListener('click', () => {
        router.go(urls.login);
      });
    }
  }
}

export default Header;
