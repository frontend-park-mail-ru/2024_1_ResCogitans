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
    await this.preRender();

    const logoGroup = document.getElementById('logo-group') as HTMLElement;
    const logo = new Logo(logoGroup);
    logo.render();

    const profileBlock = document.getElementById('button-group') as HTMLElement;

    if (this.userData !== null) {

      const username = this.userData.username;
      const userID = this.userData.userID;
      
      await new Link(profileBlock, { className: 'user-link', label: username, url : `/profile/${userID}` }).render();
      await new Button(profileBlock, { id: 'logout', label: 'Выйти' }).render();

      const logoutButton = document.getElementById('logout') as HTMLElement;

      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        authorize('logout');
        router.go(urls.base);
      });
    } else {
      console.log('what');
      await new Button(profileBlock, { className: 'login-button', id: 'button-login', label: 'Войти', url : '/login' }).render();
    }
  }
}

export default Header;
