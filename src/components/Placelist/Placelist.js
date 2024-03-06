import Place from './Place/Place';
import template from './Placelist.hbs';
import { get } from '../../../api/api.js';

class Placelist {
  constructor(parent) {
    this.parent = parent;
    this.city = 'Paris';
    this.places = []
  }

  getHTML() {
    return template(this.city);
  }

  getPlaces(data) {
    this.places = data
    this.renderPlaces()
  }

  renderPlaces() {
    const placelist = document.getElementById('list-places');
    this.places.sights.forEach((data) => new Place(placelist, data).render());
  }

  render() {
    this.parent.insertAdjacentHTML('afterend', this.getHTML());
    const places = get('http://jantugan.ru/sights', this.getPlaces.bind(this));
  }
}

export default Placelist;
