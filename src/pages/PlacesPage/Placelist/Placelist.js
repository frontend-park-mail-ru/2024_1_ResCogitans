import Place from './Place/Place';
import template from './Placelist.hbs';
import { get } from '../../../api/api';

/**
* Класс Placelist представляет список мест, который может быть отрендерен в HTML.
* @class
*/
class Placelist {
  /**
  * Создает новый экземпляр списка мест.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен список мест.
  */
  constructor(parent) {
    this.parent = parent;
    this.city = 'Paris';
    this.places = []
  }

  /**
  * Возвращает HTML-представление списка мест.
  * @returns {string} HTML-представление списка мест.
  */
  asHTML() {
    return template(this.city);
  }

  /**
  * Обрабатывает полученные данные мест и рендерит их в DOM.
  * @param {Object} data - Данные мест.
  */
  getPlaces(data) {
    this.places = data
    this.renderPlaces()
  }

  /**
  * Рендерит каждое место из списка в DOM.
  */
  renderPlaces() {
    const placelist = document.getElementById('list-places');
    this.places.sights.forEach((data) => new Place(placelist, data).render());
  }

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  render() {
    this.parent.insertAdjacentHTML('afterend', this.asHTML());
    const places = get('http://jantugan.ru/sights', this.getPlaces.bind(this));
  }
}

export default Placelist;
