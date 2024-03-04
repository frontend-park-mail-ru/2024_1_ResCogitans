import template from './Link.hbs';

class Link {
  constructor(parent, {
    id, className, label, url, src,
  }) {
    this.parent = parent;
    this.label = label;
    this.url = url;
    this.className = className;
    this.id = id;
    this.src = src;
  }

  getHTML() {
    return template({
      id: this.id,
      url: this.url,
      className: this.className,
      label: this.label,
      src: this.src,
    });
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}

export default Link;
