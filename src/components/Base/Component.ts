import { StandardAttributes } from '../../types/types';

class Component<T = {}> {
  element: HTMLElement;

  parameters?: T;

  stringForm: string;

  tagName: string;

  constructor(tagName: string, parameters?: T) {
    this.tagName = tagName;
    this.parameters = parameters;

    if (this.parameters) {
      for (const param in this.parameters) {
        if (param in this) {
          (this as any)[param] = this.parameters[param];
        }
      }
    }

    this.setType();
  }

  setType() {
    this.stringToHTML();
  }

  stringToHTML() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.stringForm, 'text/html');
    this.element = doc.body.firstChild as HTMLElement;
    if (this.parameters) {
      for (const param in this.parameters) {
        if (param in StandardAttributes) {
          this.element.setAttribute(param, this.parameters[param]);
        }
      }
    }
  }
}

export default Component;
