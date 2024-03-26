import template from './Place.hbs';
import starSvg from './star';

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
    return template(this.data);
  }

  /**
  * Рендерит место в DOM.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const rating = document.querySelectorAll('.card-rating');
    const element = rating[rating.length - 1];
    const percentage = Math.round((this.data.rating / 5) * 103);
    for (let j = 0; j < 5; j++) {
      rating[rating.length - 1].insertAdjacentHTML('afterbegin', starSvg);
      element.querySelector('.rating-overlay').style.width = `${percentage}%`;
    }
  }
}

export default Place;
