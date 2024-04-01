import Base from '@components/Base/Base'
import { Sight } from 'src/types/api'

/**
* Класс Place представляет место, которое может быть отрендерено в HTML.
* @class
*/
class Place extends Base {

  data : Sight;
  /**
  * Создает новый экземпляр места.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлено место.
  * @param {Object} data - Объект с данными места.
  */
  constructor(parent : HTMLElement, data : Sight) {
    super(parent);
    this.data = data;
  }

  async render() {
    await this.preRender();

    const stars = document.querySelectorAll(`#card-${this.data.id} .card-rating span`) as NodeListOf<HTMLElement>;
    const fullStars = Math.round(this.data.rating);

    for (let i = 0; i < 5; i++) {
      const starElement = stars[i] as HTMLElement;
      if (i < fullStars) {
        starElement.classList.add('filled');
      } else if (i === fullStars) {
        starElement.classList.add('partial');
      } else {
        starElement.classList.add('empty');
      }
    }
}
}

export default Place;
