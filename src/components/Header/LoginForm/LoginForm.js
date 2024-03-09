import { log } from 'handlebars';
import template from './LoginForm.hbs';

import Button from '../../Button/Button';
import Input from '../../Input/Input';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import Link from '../Link/Link'
import Main from '../../../pages/Main/Main'

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
    new Input(loginForm, { field: 'username-login', type: 'text', placeholder: 'Электронная почта', className: 'form-input' }).render();
    new Input(loginForm, { field: 'username-password', type: 'password', placeholder: 'Пароль', className: 'form-input' }).render();
    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit', className: 'form-input',
    }).render();
    new Button(loginForm, { id: 'register-button', label: 'Регистрация' }).render();
    console.log(document.getElementById('username-login').value)

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const username = document.getElementById('username-login').value;
      const password = document.getElementById('username-password').value;
      fetch('http://jantugan.ru/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.Code != null) {
          new Link(loginForm, {className : 'err-link', label: data.error}).render()
        } else if (data.SessionID !== null) {
          const root = document.getElementById('root');
          root.innerHTML = ''
          console.log(data)
          localStorage.setItem('username', data.User.username)
          sessionStorage.setItem('sessionID', data.SessionID)
          new Main(document.getElementById('root')).render();
        }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
});
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
}

export default LoginForm;
