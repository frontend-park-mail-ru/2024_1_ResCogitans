import template from './Logo.hbs';

class Logo {
  constructor(parent) {
    console.log(parent)
    this.parent = parent;
  }

  asHTML() {
    return template();
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Logo;
