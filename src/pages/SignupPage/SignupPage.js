import template from './SignupPage.hbs';
import SignupForm from './SignupForm/SignupForm';

/**
* Класс SignupPage представляет страницу регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupPage {
  /**
  * Создает новый экземпляр страницы регистрации.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена страница.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление страницы регистрации.
  * @returns {string} HTML-представление страницы регистрации.
  */
  asHTML() {
    return template(this);
  }

  /**
  * Рендерит страницу регистрации в DOM, включая форму регистрации.
  */
  render() {
    document.body.style.backgroundImage = 'url(\'../../static/bgsignup.jpg\')';
    new SignupForm(this.parent).render();
  }
}

export default SignupPage;
