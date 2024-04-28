import Button from '@components/Button/Button';
import Logo from '@components/Logo/Logo';
import Link from '@components/Link/Link';
import urls from '@router/urls';
import  { router } from '@router/router';
import { authorize } from '@api/user';
import Base from '@components/Base/Base';
import template from '@templates/Header.hbs';

/**
* Класс Header. Это шапка сайта.
* @class
*/
class Header extends Base {

  constructor(parent: HTMLElement) {
    super(parent, template); 
  }
  
  /**
  * Рендерит блок ссылок в DOM.
  * @param {HTMLElement} parent - Родительский элемент, в который будут вставлены ссылки.
  * @param {Array<string>} labels - Массив меток для ссылок.
  */
  renderLinkBlock(parent : HTMLElement, labels : Array<string>) {
    labels.forEach((label) => new Link(parent, {
      label, className: 'underlined-link', 
    }).render());
  }

  /**
  * Рендерит шапку, включая логотип, ссылки и кнопки в зависимости от состояния пользователя.
  */

  render() {
    this.preRender();
    
    const logoGroup = document.getElementById('logo-group') as HTMLElement;
    const logo = new Logo(logoGroup);
    logo.render();

    const profileBlock = document.getElementById('button-group') as HTMLElement;

    if (this.userData !== null) {
      const username = this.userData.username;
      const userID = this.userData.userID;
      
      new Link(profileBlock, {
        className: 'user-link', label: username, url : `/profile/${userID}`, 
      }).render();
      new Button(profileBlock, {
        id: 'logout', label: 'Выйти', 
      }).render();

      const logoutButton = document.getElementById('logout') as HTMLElement;

      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        authorize('logout');
        router.go(urls.base);
      });
    } else {
      new Button(profileBlock, {
        className: 'login-button', id: 'button-login', label: 'Войти', 
      }).render();
      const loginButton = document.getElementById('button-login');
      loginButton?.addEventListener('click', () => {
        router.go('login');
      });
    }
  }
}

export default Header;
