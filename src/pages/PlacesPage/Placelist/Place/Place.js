import template from './Place.hbs';

class Place {
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
  }

  asHTML() {
    return template(this.data);
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Place;
