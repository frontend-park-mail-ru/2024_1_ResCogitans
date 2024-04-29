import Base from '@components/Base/Base';
import template from '@templates/Button.hbs';

/**
* Класс Button. Все кнопки являются экземплярами класса Button.
* Отвечает за отношение с другими объектами HTML верстки, типом и url.
* @class

*/class Button extends Base {

  id? : string;

  label? : string;

  className? : string;

  url? : string;

  img? : string;

  type? : string;

  /**
  * Создает новый экземпляр кнопки.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена кнопка.
  * @param {Object} options - Объект с параметрами кнопки.
  * @param {string} options.id - Идентификатор кнопки.
  * @param {string} [options.label=''] - Текст кнопки.
  * @param {string} [options.className=''] - CSS-класс кнопки.
  * @param {string} [options.img=''] - URL изображения для кнопки.
  * @param {string} [options.url=''] - URL, на который будет осуществлен редирект после нажатия.
  * @param {string} [options.type=''] - Тип кнопки (например, 'submit').
  */
  constructor(parent : HTMLElement, {
    id, label, className, img, url, type, 
  } : 
  { id? : string,
    label? : string,
    className? : string,
    img? : string,
    url? : string,
    type? : string }) {

    super(parent, template);
    this.id = id;
    this.label = label;
    this.className = className;
    this.url = url;
    this.img = img;
    this.type = type;
  }

}

export default Button;
