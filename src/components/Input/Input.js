import template from './Input.hbs';

class Input {
  constructor(parent, {
    id = '', placeholder = '', type = 'text', img = '', className = '',
  }) {
    this.parent = parent;
    this.id = id;
    this.placeholder = placeholder;
    this.type = type;
    this.img = img;
    this.className = className;
  }

  getHTML() {
    return template({
      id: this.id,
      placeholder: this.placeholder,
      type: this.type,
      img: this.img,
      className: this.className,
    });
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}

export default Input;
