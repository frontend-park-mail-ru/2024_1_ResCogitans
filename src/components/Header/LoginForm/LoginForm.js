import { log } from 'handlebars';
import template from './LoginForm.hbs';

import Button from '../../Button/Button';
import Input from '../../Input/Input';
import RegistrationForm from '../RegistrationForm/RegistrationForm';

class LoginForm {
  constructor(parent, display) {
    this.parent = parent;
    this.display = display;
  }

  getHTML() {
    return template(this.display);
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    const loginForm = document.getElementById('login-form');
    new Input(loginForm, { type: 'email', placeholder: 'Электронная почта', className: 'form-input' }).render();
    new Input(loginForm, { type: 'password', placeholder: 'Пароль', className: 'form-input' }).render();
    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit', className: 'form-input',
    }).render();
    new Button(loginForm, { id: 'register-button', label: 'Регистрация' }).render();

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', (e) => {
      let state = 0;
      let form;
      const content = document.getElementById('root');
      const loginForm = document.getElementById('login-form-div');
      switch (state) {
        case 0:
          content.removeChild(loginForm);
          new RegistrationForm(content, { display: 'flex' }).render();
          state = 2;
          form = document.getElementById('registration-form-div');
          break;
        case 1:
          form.style.display = 'none';
          state = 2;
          break;
        case 2:
          form.style.display = 'flex';
          state = 1;
          break;
        default:
          state = 1;
      }
    });
  }

  // где-то тут надо навесить на кнопку сабмит формы, передачу логина пароля на сервер
}

export default LoginForm;
