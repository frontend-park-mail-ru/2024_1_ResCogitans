import Base from '@components/Base/Base';
import { Sight } from 'src/types/api';
import Stars from '@components/Stars/Stars';

/**
* Класс Place представляет место, которое может быть отрендерено в HTML.
* @class
*/
class Place extends Base {

  data : Sight;

class Place extends Base {

  data : Sight;

  /**
  * Создает новый экземпляр места.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлено место.
  * @param {Object} data - Объект с данными места.
  */
  constructor(parent : HTMLElement, data : Sight) {
    super(parent);
  constructor(parent : HTMLElement, data : Sight) {
    super(parent);
    this.data = data;
  }

  async render() {
    await this.preRender();
    const stars = document.querySelector(`#card-${this.data.id} .rating`) as HTMLDivElement;
    await new Stars(stars, this.data.rating).render();
  }
}

export default Place;
