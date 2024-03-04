import template from './Logo.hbs';

class Logo {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return template();
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}

export default Logo;
