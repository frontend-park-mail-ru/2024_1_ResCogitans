import template from './Link.hbs';

/**
* Класс Link. Представляет ссылку, которая может быть отрендерена в HTML.
* @class
*/
class Link {
  /**
  * Создает новый экземпляр ссылки.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена ссылка.
  * @param {Object} options - Объект с параметрами ссылки.
  * @param {string} options.id - Идентификатор ссылки.
  * @param {string} options.className - CSS-класс ссылки.
  * @param {string} options.label - Текст ссылки.
  * @param {string} options.url - URL, на который будет перенаправлен пользователь при нажатии на ссылку.
  * @param {string} [options.src=''] - URL изображения для ссылки.
  */
  constructor(parent, {
    id, className, label, url, src,
  }) {
    this.parent = parent;
    this.label = label;
    this.url = url;
    this.className = className;
    this.id = id;
    this.src = src;
  }

  /**
  * Возвращает HTML-представление ссылки.
  * @returns {string} HTML-представление ссылки.
  */
  asHTML() {
    return template({
      id: this.id,
      url: this.url,
      className: this.className,
      label: this.label,
      src: this.src,
    });
  }

  /**
  * Рендерит ссылку в DOM.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Link;
