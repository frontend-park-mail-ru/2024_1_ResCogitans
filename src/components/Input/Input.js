import template from './Input.hbs';

class Input {
  constructor(parent, {
    field = '', id = '', placeholder = '', type = 'text', img = '', className = '',
  }) {
    this.parent = parent;
    this.field = field;
    this.placeholder = placeholder;
    this.type = type;
    this.img = img;
    this.className = className;
    this.id = id;
  }

  asHTML() {
    return template({
      id: this.id,
      placeholder: this.placeholder,
      type: this.type,
      img: this.img,
      className: this.className,
      field: this.field,
    });
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
  }
}

export default Input;
