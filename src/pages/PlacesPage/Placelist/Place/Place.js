import template from './Place.hbs';

class Place {
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
  }

  asHTML() {
    this.data.url = this.data.url.replace("public","");
    return template(this.data);
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Place;
