import Base from '@components/Base/Base';
import template from '@templates/Input.hbs';

/**
* Класс Input. Экземпляры этого класса - строки для ввода данных.
* @class
*/
class Input extends Base {

  field? : string;

  id? : string;

  placeholder? : string;

  type? : string;

  img? : string;

  className? : string;

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
  constructor(parent : HTMLElement, {
    field, id, placeholder, type, img, className, 
  } : 
  { field? : string,
    id? : string,
    placeholder? : string,
    type? : string,
    img? : string,
    className? : string
  }) {
    super(parent, template);
    this.field = field;
    this.placeholder = placeholder;
    this.type = type;
    this.img = img;
    this.className = className;
    this.id = id;
  }
}

export default Input;
