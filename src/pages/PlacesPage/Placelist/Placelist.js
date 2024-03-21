import Place from './Place/Place';
import template from './Placelist.hbs';
import getSights from '../../../api/sights';

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
    this.places = [];
  }

  /**
  * Возвращает HTML-представление списка мест.
  * @returns {string} HTML-представление списка мест.
  */
  asHTML() {
    return template(this.city);
  }

  /**
  * Рендерит каждое место из списка в DOM.
  */
  renderPlaces(places) {
    const placelist = document.getElementById('list-places');
    places.sights.forEach((data) => new Place(placelist, data).render());
  }

  /**
  * Рендерит список мест в DOM и запрашивает данные мест.
  */
  render() {
    this.parent.insertAdjacentHTML('afterend', this.asHTML());
    getSights('http://localhost:8080/sights')
      .then((responsePlaces) => this.renderPlaces(responsePlaces));
  }
}

export default Placelist;
