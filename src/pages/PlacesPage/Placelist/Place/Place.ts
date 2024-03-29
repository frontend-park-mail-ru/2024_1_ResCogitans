import Base from '../../../../components/Base/Base'
import { starSvg } from './star';

interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
  url: string
}

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

    const stars = document.querySelector(`#card-${this.data.id} .card-rating`) as HTMLElement;
    const fullStars = Math.floor(this.data.rating);
    const gradientPercentage = (this.data.rating % 1) * 100;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.insertAdjacentHTML('beforeend', starSvg(100));
      } else if (i === fullStars) {
        stars.insertAdjacentHTML('beforeend', starSvg(gradientPercentage));
      } else {
        stars.insertAdjacentHTML('beforeend', starSvg(0));
      }
    }
}
}

export default Place;
