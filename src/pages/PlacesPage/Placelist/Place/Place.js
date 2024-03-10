import template from './Place.hbs';

/**
* Класс Place представляет место, которое может быть отрендерено в HTML.
* @class
*/
class Place {
  /**
  * Создает новый экземпляр места.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлено место.
  * @param {Object} data - Объект с данными места.
  */
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
  }

  /**
  * Возвращает HTML-представление места.
  * @returns {string} HTML-представление места.
  */
  asHTML() {
    this.data.url = this.data.url.replace('public', '');
    return template(this.data);
  }

  /**
  * Рендерит место в DOM.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Place;
