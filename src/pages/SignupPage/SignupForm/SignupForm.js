import template from './SignupForm.hbs';

import Button from '../../../components/Button/Button';
import urls from '../../../router/urls';
import Logo from '../../../components/Header/Logo/Logo';
import { signup } from '../../../api/user';
import { router } from '../../../router/Router';
import { userHelper } from '../../../utils/localstorage';
import { validate } from '../../../utils/validation';

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

  renderError(parent, message) {
    let errorMessage = parent.querySelectorAll('.err-label')[0];
    if (message !== null) {
      errorMessage.innerHTML = message;
      errorMessage.classList.add('active'); 
    } else {
      errorMessage.innerHTML = "";
      errorMessage.classList.remove('active');
    }
  }

  /**
  * Отображает ошибку или перенаправляет пользователя в зависимости от ответа сервера.
  * @param {Object} response - Ответ сервера.
  */
  displayErrorOrRedirect(response, code) {
    if (response.Code == null) {
      userHelper('set', response.User.username);
      router.go(urls.base);
    } else if (response.ok) {
      this.renderError("Эта почта уже используется");
    } else if (code == 503) {
      this.renderError("Что-то пошло не так");
    }
  }

  togglePasswordVisibility(inputWithButton) {
    const icons = inputWithButton.querySelectorAll('img');
    if (inputWithButton.children[1].type === 'password') {
        inputWithButton.children[1].type = 'text';
        icons.forEach((icon) => icon.src = 'static/no_visible.svg');
      } else {
        inputWithButton.children[1].type = 'password';
        icons.forEach((icon) => icon.src = 'static/visible.svg');
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

    document.querySelectorAll('.input-button').forEach((input) => input.children[2].addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePasswordVisibility(input);
    }));


    const registrationForm = document.getElementById('registration-form');
    new Button(registrationForm, { id: 'login-button', label: 'Зарегистрироваться', type: 'submit' }).render();
    const submitButton = document.getElementById('login-button');
    submitButton.disabled = true;

    let username = emailInput.value;
    let password = passwordInput.value;
    let repeatPassword = passwordRepeatInput.value;

    document.querySelectorAll('.input').forEach((input) => input.children[1].addEventListener('input', (e) => {
      e.preventDefault();
      submitButton.disabled = true;
      let validationError;
      let type = input.children[1].type;

      password = passwordInput.value;
      repeatPassword = passwordRepeatInput.value;

      if (type == 'email') {
        validationError = validate(e.target.value, 1);
        if (validationError !== null) {
          this.renderError(input, validationError);
          return;
        } else {
          this.renderError(input, null);
        }
      } else {
        validationError = validate(e.target.value, 2);
          if (validationError !== null) {
            this.renderError(input, validationError);
            return;
          } else {
            if (password != repeatPassword) {
              this.renderError(input, "Пароли не совпадают");
              return;
            }
            submitButton.disabled = false;
            document.querySelectorAll('.input-button').forEach((input) => this.renderError(input, null));
            return;
          }
      }
    }));

    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
        signup('http://localhost:8080', { username, password }, this.displayErrorOrRedirect.bind(this));
      }
    );
  }
}

export default SignupForm;
