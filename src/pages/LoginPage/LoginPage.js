import template from './LoginPage.hbs';
import LoginForm from './LoginForm/LoginForm';

/**
* Класс LoginPage представляет страницу входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginPage {
  /**
  * Создает новый экземпляр страницы входа.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена страница входа.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление страницы входа.
  * @returns {string} HTML-представление страницы входа.
  */
  asHTML() {
    return template(this);
  }

  /**
  * Рендерит страницу входа в DOM, включая форму входа.
  */
  render() {
    document.body.style.backgroundImage = 'url(\'../../static/bglogin.webp\')';
    new LoginForm(this.parent).render();
  }
}

export default LoginPage;

