import template from './Place.hbs';

class Place {
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
  }

  getHTML() {
    return template(this.data);
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}

export default Place;
