import template from './LoginForm.hbs';
import Button from '../../../components/Button/Button';
import urls from '../../../router/urls';
import Logo from '../../../components/Header/Logo/Logo';
import { router } from '../../../router/Router';
import { userHelper } from '../../../utils/localstorage';
import { login } from '../../../api/user';
import { validate } from '../../../utils/validation';
import AuthorizationForm from '../../../components/Form/AuthorizationForm';

/**
* Класс LoginForm представляет форму входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginForm extends AuthorizationForm {
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

    document.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => {
      validate({ string: input.value, type: input.type })
        .catch((error) => {this.renderError(input.parentElement, error.message)})
        .then(() => {
          this.enableSubmitButton();
        });
        this.clearError(input.parentElement);
    }));


    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      login(process.env.API_URL, requestBody)
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
