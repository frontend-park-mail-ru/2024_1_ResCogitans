import User from 'src/types/api';

class Base {

  parent: HTMLElement;

  userData : User;

  isAuth : boolean;

  template : HandlebarsTemplateDelegate;

  constructor(parent : HTMLElement, template : HandlebarsTemplateDelegate | undefined) {
    this.parent = parent;
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.template = template;
  }

  preRender(element? : HTMLElement) {
    const html = this.template(this);
    if (element !== undefined) {
      element.insertAdjacentHTML('beforeend', html);
    } else {
      this.parent.insertAdjacentHTML('beforeend', html);
    }
  }

  render() {
    this.preRender();
  }
}

export default Base;
