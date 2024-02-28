import template from './Link.hbs'

class Link {

    constructor(parent, {id, _class, label, url, src}) {
        this.parent = parent;
        this.label = label;
        this.url = url;
        this._class = _class;
        this.id = id;
        this.src = src;
    }



    getHTML() {
        return template({
            id: this.id,
            url: this.url,
            _class: this._class,
            label: this.label,
            src: this.src
        })
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    }
}

export default Link;