import template from './LoginForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Header/Logo/Logo';
import urls from '../../../router/urls';
import Link from '../../../components/Header/Link/Link';
import { router } from '../../../router/Router';
import { login } from '../../../api/api';

/**
* Класс LoginForm представляет форму входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginForm {
  /**
  * Создает новый экземпляр формы входа.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена форма входа.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление формы входа.
  * @returns {string} HTML-представление формы входа.
  */
  asHTML() {
    return template(this.display);
  }

  /**
  * Отображает ошибку или перенаправляет пользователя в зависимости от ответа сервера.
  * @param {Object} response - Ответ сервера.
  */
  displayErrorOrRedirect(response) {
    if (response.error == null) {
      localStorage.setItem('username', response.User.username);
      router.go(urls.sights);
    } else {
      const loginForm = document.getElementById('login-form');
      document.getElementById('form-error')?.remove();
      new Link(loginForm, { id: 'form-error', className: 'err-link', label: response.error }).render();
    }
  }

  /**
  * Рендерит форму входа в DOM, включая логотип, поля ввода и кнопки.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());

    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();
    const loginForm = document.getElementById('login-form');
    new Input(loginForm, {
      field: 'username-login', type: 'text', placeholder: 'Электронная почта', className: 'form-input',
    }).render();
    new Input(loginForm, {
      field: 'username-password', type: 'password', placeholder: 'Пароль', className: 'form-input',
    }).render();
    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit',
    }).render();
    new Button(loginForm, { id: 'register-button', label: 'Регистрация' }).render();

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username-login').value;
      const password = document.getElementById('username-password').value;
      login('http://jantugan.ru', { username, password }, this.displayErrorOrRedirect);
    });

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', (e) => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
