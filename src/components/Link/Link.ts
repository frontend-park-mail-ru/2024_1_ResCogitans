import Base from '@components/Base/Base';
import template from '@templates/Link.hbs';

/**
* Класс Link. Представляет ссылку, которая может быть отрендерена в HTML.
* @class
*/
class Link extends Base {

  label : string | undefined;

  url : string | undefined;

  className : string | undefined;

  id : string | undefined;

  src : string | undefined;

  /**
  * Создает новый экземпляр ссылки.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена ссылка.
  * @param {Object} options - Объект с параметрами ссылки.
  * @param {string} options.id - Идентификатор ссылки.
  * @param {string} options.className - CSS-класс ссылки.
  * @param {string} options.label - Текст ссылки.
  * @param {string} options.url - URL, на который будет осуществлен редирект после нажатия.
  * @param {string} [options.src=''] - URL изображения для ссылки.
  */
  constructor(parent : HTMLElement, {
    id, className, label, url, src, 
  } : 
  { id? : string, 
    className? : string,
    label? : string, 
    url? : string, 
    src? : string })  {
    super(parent, template);
    this.label = label;
    this.url = url;
    this.className = className;
    this.id = id;
    this.src = src;
  }
}

export default Link;
