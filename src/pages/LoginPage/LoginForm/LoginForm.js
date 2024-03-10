import template from './LoginForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Header/Logo/Logo'
import urls from '../../../router/urls'
import Link from '../../../components/Header/Link/Link'
import { router } from '../../../router/Router'
import { login } from '../../../api/api'

class LoginForm {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template(this.display);
  }

  displayErrorOrRedirect(response) {
    if (response.error === null) {
      console.log(urls.base);
      router.go(urls.base);
    } else {
      const loginForm = document.getElementById('login-form');
      document.getElementById('form-error')?.remove();
      new Link(loginForm, {id: 'form-error', className: "err-link", label: response.error}).render();
    }
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());

    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();
    const loginForm = document.getElementById('login-form');
    new Input(loginForm, { field: 'username-login', type: 'text', placeholder: 'Электронная почта', className: 'form-input' }).render();
    new Input(loginForm, { field: 'username-password', type: 'password', placeholder: 'Пароль', className: 'form-input' }).render();
    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit',
    }).render();
    new Button(loginForm, { id: 'register-button', label: 'Регистрация' }).render();

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const username = document.getElementById('username-login').value;
      const password = document.getElementById('username-password').value;
      login("http://jantugan.ru", {username: username, password: password}, this.displayErrorOrRedirect);
    });


    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', (e) => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
