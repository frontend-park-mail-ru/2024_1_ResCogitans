import BaseForm from '../../../components/Form/BaseForm';
import template from './LoginForm.hbs';
import Button from '../../../components/Button/Button';
import urls from '../../../router/urls';
import Logo from '../../../components/Header/Logo/Logo';
import { router } from '../../../router/Router';
import { userHelper } from '../../../utils/localstorage';
import { login } from '../../../api/user';
import { validate } from '../../../utils/validation';

/**
* Класс LoginForm представляет форму входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginForm extends BaseForm {
  /**
    * Возвращает HTML-представление формы входа.
    * @returns {string} HTML-представление формы входа.
    */
  asHTML() {
    return template(this.display);
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
      id: 'signup-button', label: 'Регистрация',
    }).render();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    this.enablePasswordVisibilityButtons();

    const submitButton = document.getElementById('login-button');
    submitButton.disabled = true;

    const inputs = document.querySelectorAll('.input');

    inputs.forEach((input) => input.children[1].addEventListener('blur', (e) => {
      e.preventDefault();
      const { type } = input.children[1];
      submitButton.disabled = true;

      const validationError = validate({ string: e.target.value, type });
      this.renderError(input, validationError);
      if (document.querySelectorAll('.has-error').length === 0) {
        submitButton.disabled = false;
      }
    }));

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      login('http://127.0.0.1:8080', requestBody)
        .then((response) => {
          if (response.Code === undefined) {
            userHelper('set', response.User.username);
            router.go(urls.base);
          } else if (response.Code === 400 || response.Code === 500) {
            this.renderError(inputs[1], response.error);
          }
        });
    });

    const registerButton = document.getElementById('signup-button');
    registerButton.addEventListener('click', () => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
