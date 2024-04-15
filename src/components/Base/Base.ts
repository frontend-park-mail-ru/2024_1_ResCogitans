import User from 'src/types/api';

class Base {

  parent: HTMLElement;

  userData : User;

  isAuth : boolean;

  template: HandlebarsTemplateDelegate;

  constructor(parent : HTMLElement) {
    this.parent = parent;
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.isAuth = (this.userData !== null);
  }

   
  async loadTemplate() {
    const templateModule = await import(`../../templates/${this.constructor.name}.hbs`);
    this.template = templateModule.default;
  }

  async preRender(element? : HTMLElement) {
    await this.loadTemplate();
    const html = this.template(this);
    if (element !== undefined) {
      element.insertAdjacentHTML('beforeend', html);
    } else {
      this.parent.insertAdjacentHTML('beforeend', html);
    }
  }

  async render() {
    await this.preRender();
  }
}
export default Base;
