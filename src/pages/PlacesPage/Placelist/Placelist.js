import Place from './Place/Place';
import template from './Placelist.hbs';
import { get } from '../../../api/api';

class Placelist {
  constructor(parent) {
    this.parent = parent;
    this.city = 'Paris';
    this.places = []
  }

  asHTML() {
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
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const places = get('http://jantugan.ru/sights', this.getPlaces.bind(this));
  }
}

export default Placelist;
