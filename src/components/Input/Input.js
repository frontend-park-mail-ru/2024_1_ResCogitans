import template from './Input.hbs';

/**
* Класс Input. Экземпляры этого класса - строки для ввода данных.
* @class
*/
class Input {
  /**
  * Создает новый экземпляр поля ввода.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлено поле ввода.
  * @param {Object} options - Объект с параметрами поля ввода.
  * @param {string} [options.field=''] - Имя поля ввода.
  * @param {string} [options.id=''] - Идентификатор поля ввода.
  * @param {string} [options.placeholder=''] - Подсказка в поле ввода.
  * @param {string} [options.type='text'] - Тип поля ввода (например, 'text', 'password').
  * @param {string} [options.img=''] - URL изображения для поля ввода.
  * @param {string} [options.className=''] - CSS-класс поля ввода.
  */
  constructor(parent, {
    field = '', id = '', placeholder = '', type = 'text', img = '', className = '',
  }) {
    this.parent = parent;
    this.field = field;
    this.placeholder = placeholder;
    this.type = type;
    this.img = img;
    this.className = className;
    this.id = id;
  }

  /**
  * Возвращает HTML-представление поля ввода.
  * @returns {string} HTML-представление поля ввода.
  */
  asHTML() {
    return template({
      id: this.id,
      placeholder: this.placeholder,
      type: this.type,
      img: this.img,
      className: this.className,
      field: this.field,
    });
  }

  /**
  * Рендерит поле ввода в DOM.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Input;
