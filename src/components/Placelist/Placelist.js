import Place from './Place/Place';
import template from './Placelist.hbs';
import { get } from '../../../api/api.js';

class Placelist {
  constructor(parent) {
    this.parent = parent;
    this.city = 'Paris';
  }

  getHTML() {
    return template(this.city);
  }

  render(data) {
    this.parent.insertAdjacentHTML('afterend', this.getHTML());
    const placelist = document.getElementById('list-places');
    const places = get('http://localhost:8080/sights');
    places.forEach((data) => new Place(placelist, data).render());
  }
}

export default Placelist;
