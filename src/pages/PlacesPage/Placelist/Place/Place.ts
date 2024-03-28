import template from './Place.hbs';
import starSvg from './star';
import Base from '../../../../components/Base/Base'


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
    const htmlView = await this.asHTML()
    this.parent.insertAdjacentHTML('beforeend', htmlView);
    const rating = document.querySelectorAll('.card-rating');
    const element = rating[rating.length - 1];
    const percentage = Math.round((this.data.rating / 5) * 103);
    for (let j = 0; j < 5; j++) {
      rating[rating.length - 1].insertAdjacentHTML('afterbegin', starSvg);
      const filter =  element.querySelector('.rating-overlay') as HTMLDivElement;
      filter.style.width = `${percentage}%`;
    }
  }
}

export default Place;
