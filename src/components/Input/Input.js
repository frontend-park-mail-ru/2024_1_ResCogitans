import template from './Input.hbs'

class Input {
    constructor(parent, {id = '', placeholder = '', type='text', img='', _class=''}) {
        this.parent = parent;
        this.id = id;
        this.placeholder = placeholder;
        this.type = type;
        this.img = img;
        this._class = _class;
    }

    getHTML() {
        return template({
            id: this.id,
            placeholder: this.placeholder,
            type: this.type,
            img: this.img,
            _class: this._class
        });
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());        
    }
}

export default Input;