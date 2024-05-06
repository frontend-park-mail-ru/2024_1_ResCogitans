import User, { UserProfile } from 'src/types/api';

class Base {

  parent: HTMLElement | undefined;

  userData: UserProfile;

  isAuth: boolean;

  template: HandlebarsTemplateDelegate;

  constructor(parent: HTMLElement | undefined, template: HandlebarsTemplateDelegate | undefined) {
    this.parent = parent;
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.template = template;
  }

  preRender(element?: HTMLElement) {
    const html = this.template(this);
    if (element !== undefined) {
      element.insertAdjacentHTML('beforeend', html);
    } else {
      this.parent?.insertAdjacentHTML('beforeend', html);
    }
  }

  render() {
    this.preRender();
  }

  createElement(
    tagName: string,
    attributes: { [key: string]: string },
    content?: string,
    insertion?: { parent: HTMLElement, position?: 'before' | 'after' | 'into', referenceElement?: HTMLElement },
  ): HTMLElement {
    const element = document.createElement(tagName);
    for (const attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        element.setAttribute(attr, attributes[attr]);
      }
    }
    if (content) {
      element.textContent = content;
    }
    if (insertion) {
      const {
        parent, position, referenceElement, 
      } = insertion;
      switch (position) {
        case 'before':
          parent.insertBefore(element, referenceElement || parent.firstChild);
          break;
        case 'after':
          if (referenceElement) {
            parent.insertBefore(element, referenceElement.nextSibling);
          } else {
            parent.insertAdjacentElement('afterend', element);
          }
          break;
        case 'into':
        default:
          parent.appendChild(element);
          break;
      }
    }
    return element;
  }


}

export default Base;
