import template from './LoginForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Header/Logo/Logo';
import urls from '../../../router/urls';
import Link from '../../../components/Header/Link/Link';
import { router } from '../../../router/Router';
import { login } from '../../../api/user';
import { userHelper } from '../../../utils/localstorage';

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

  renderError(message) {
    const errorMessage = document.getElementById('error');
    errorMessage.innerHTML = message;
    errorMessage.style.color = "red";
  }

  /**
  * Отображает ошибку или перенаправляет пользователя в зависимости от ответа сервера.
  * @param {Object} response - Ответ сервера.
  */
  displayErrorOrRedirect(response) {
    if (response.Code == null) {
      userHelper('set', response.User.username);
      router.go(urls.base);
    } else if (response.Code != null) {
      this.renderError("Неверный логин или пароль");
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
    
    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit',
    }).render();
    new Button(loginForm, { id: 'register-button', label: 'Регистрация' }).render();


    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const passwordVisibility = document.getElementById('password-visible');
    passwordVisibility.addEventListener('click', (e) => {
      e.preventDefault();
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordVisibility.children[0].src = "static/no_visible.svg";
      } else {
        passwordInput.type = 'password';
        passwordVisibility.children[0].src = "static/visible.svg";
      }
    })

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = emailInput.value;
      const password = passwordInput.value;
      login('http://localhost:8080', { username, password }, this.displayErrorOrRedirect.bind(this));
    });

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', () => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
