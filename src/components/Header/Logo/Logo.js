import template from './Logo.hbs';

/**
* Класс Logo представляет логотип, который может быть отрендерен в HTML.
* @class
*/
class Logo {
  /**
  * Создает новый экземпляр логотипа.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен логотип.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление логотипа.
  * @returns {string} HTML-представление логотипа.
  */
  asHTML() {
    return template();
  }

  /**
  * Рендерит логотип в DOM.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Logo;
