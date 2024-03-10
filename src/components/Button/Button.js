import template from './Button.hbs';

/**
 * Класс Button. Все кнопки являются экземплярами класса Button. Отвечает за отношение с другими объектами HTML верстки, типом и url.
 * @class
 */
class Button {
  /**
   * Создает новый экземпляр кнопки.
   * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена кнопка.
   * @param {Object} options - Объект с параметрами кнопки.
   * @param {string} options.id - Идентификатор кнопки.
   * @param {string} [options.label=''] - Текст кнопки.
   * @param {string} [options.className=''] - CSS-класс кнопки.
   * @param {string} [options.img=''] - URL изображения для кнопки.
   * @param {string} [options.url=''] - URL, на который будет перенаправлен пользователь при нажатии на кнопку.
   * @param {string} [options.type=''] - Тип кнопки (например, 'submit').
   */
  constructor(parent, {
    id, label = '', className = '', img = '', url = '', type = '',
  }) {
    this.parent = parent;
    this.id = id;
    this.label = label;
    this.className = className;
    this.url = url;
    this.img = img;
    this.type = type;
  }

  /**
   * Возвращает HTML-представление кнопки.
   * @returns {string} HTML-представление кнопки.
   */
  asHTML() {
    return template({
      id: this.id,
      label: this.label,
      className: this.className,
      url: this.url,
      img: this.img,
      type: this.type,
    });
  }

  /**
   * Рендерит кнопку в DOM.
   * @returns {HTMLElement} Элемент кнопки в DOM.
   */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    return (document.getElementById(this.id))
  }
}

export default Button;
