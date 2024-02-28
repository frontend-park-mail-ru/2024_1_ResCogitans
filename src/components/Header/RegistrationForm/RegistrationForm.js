import template from './RegistrationForm.hbs'

import Button from '../../Button'
import Input from '../../Input'

class RegistrationForm {

    constructor(parent, display) {
        this.parent = parent;
        this.display = display;
    }

    getHTML() {
        return template(this.display);
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        const registrationForm = document.getElementById('registration-form');
        new Input(registrationForm, {type: 'email', placeholder: 'Электронная почта', _class: "form-input"}).render();
        new Input(registrationForm, {type: 'password', placeholder: 'Пароль', _class: "form-input"}).render();
        new Input(registrationForm, {type: 'password', placeholder: 'Повторите пароль', _class: "form-input"}).render();
        new Button(registrationForm, {id: 'register-button', label: 'Зарегистрироваться'}).render();
    }
}

export default RegistrationForm;