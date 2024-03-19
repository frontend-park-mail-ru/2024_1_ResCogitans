import template from './LoginForm.hbs';

import Button from '../../../components/Button/Button';
import Logo from '../../../components/Header/Logo/Logo';
import urls from '../../../router/urls';
import { router } from '../../../router/Router';
import { login } from '../../../api/user';
import { userHelper } from '../../../utils/localstorage';
import { validate } from '../../../utils/validation';

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
    } else if (response.Code != null) {
      this.renderError("Неверный логин или пароль");
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
    new Button(loginForm, { 
      id: 'signup-button', label: 'Регистрация'
    }).render();


    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    document.querySelectorAll('.input-button').forEach((input) => input.children[2].addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePasswordVisibility(input);
    }));

    const submitButton = document.getElementById('login-button');
    submitButton.disabled = true;

    document.querySelectorAll('.input').forEach((input) => input.children[1].addEventListener('input', (e) => {
      e.preventDefault();
      let validationError;
      let type = input.children[1].type;

      password = passwordInput.value;

      if (type == 'email') {
        validationError = validate(e.target.value, 1);
        if (validationError !== null) {
          this.renderError(input, validationError);
          return;
        }
        this.renderError(input, null);
      } else {
        validationError = validate(e.target.value, 2);
        if (validationError !== null) {
          this.renderError(input, validationError);
          return;
        }
        submitButton.disabled = false;
        document.querySelectorAll('.input-button').forEach((input) => this.renderError(input, null)); // сомнительно но окэй
        return;
        }
    }));

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = emailInput.value;
      const password = passwordInput.value;
      login('http://localhost:8080', { username, password }, this.displayErrorOrRedirect.bind(this));
    });

    const registerButton = document.getElementById('signup-button');
    registerButton.addEventListener('click', () => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
