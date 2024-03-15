import template from './SignupForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Link from '../../../components/Header/Link/Link';
import urls from '../../../router/urls';
import Logo from '../../../components/Header/Logo/Logo';
import { signup } from '../../../api/user';
import { router } from '../../../router/Router';
import { userHelper } from '../../../utils/localstorage';

/**
* Класс SignupForm представляет форму регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupForm {
  /**
  * Создает новый экземпляр формы регистрации.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена форма регистрации.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление формы регистрации.
  * @returns {string} HTML-представление формы регистрации.
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
    } else {
      this.renderError("Эта почта уже используется");
    }
  }

  /**
  * Рендерит форму регистрации в DOM, включая логотип, поля ввода и кнопку.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordRepeatInput = document.getElementById('password-repeat');

    document.querySelectorAll('.form-button').forEach((form) => form.children[1].addEventListener('click', (e) => {
      e.preventDefault();
      if (form.children[0].type === 'password') {
        form.children[0].type = 'text';
        form.children[1].children[0].src = "static/no_visible.svg";
      } else {
        form.children[0].type = 'password';
        form.children[1].children[0].src = "static/visible.svg";
      }
    }));

    const registrationForm = document.getElementById('registration-form');
    new Button(registrationForm, { id: 'login-button', label: 'Зарегистрироваться', type: 'submit' }).render();

    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = emailInput.value;
      const password = passwordInput.value;
      const passwordRepeat = passwordRepeatInput.value;

      if (password !== passwordRepeat) {
        this.renderError("Пароли не совпадают");
      } else {
        signup('http://localhost:8080', { username, password }, this.displayErrorOrRedirect.bind(this));
      }
    });
  }
}

export default SignupForm;
