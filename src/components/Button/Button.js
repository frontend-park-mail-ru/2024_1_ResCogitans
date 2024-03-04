import template from './Button.hbs';

class Button {
  constructor(parent, {
    id, label = '', className = '', img = '', url = '', type = '',
  }) {
    this.parent = parent;
    this.id = id;
    this.label = label;
    this.className = className; // css class
    this.url = url;
    this.img = img;
    this.type = type;
  }

  getHTML() {
    return template({
      id: this.id,
      label: this.label,
      className: this.className,
      url: this.url,
      img: this.img,
      type: this.type,
    });
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}

export default Button;
