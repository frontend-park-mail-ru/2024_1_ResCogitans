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

  async render() {
    const htmlView = await this.asHTML()
    this.parent.insertAdjacentHTML('beforeend', htmlView);

    const logoGroup = document.getElementById('logo-group') as HTMLDivElement;
    new Logo(logoGroup).render();
    const loginForm = document.getElementById('login-form') as HTMLDivElement;

    new Button(loginForm, {
      id: 'login-button', label: 'Войти', type: 'submit',
    }).render();
    new Button(loginForm, {
      id: 'signup-button', label: 'Регистрация',
    }).render();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    this.enablePasswordVisibilityButtons();

    const submitButton = document.getElementById('login-button') as HTMLButtonElement;
    submitButton.disabled = true;

    const inputs = document.querySelectorAll('.input');

    document.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => {
      const inputParent = input.parentElement as HTMLDivElement;
      validate( input.value, input.type )
        .catch((error) => { this.renderError(inputParent, error.message); })
        .then(() => {
          this.enableSubmitButton();
        });
      this.clearError(inputParent);
    }));

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      if (process.env.API_URL !== null && process.env.API_URL !== undefined) {
        login(process.env.API_URL, requestBody)
        .then((response) => {
          if (response.Code === undefined) {
            userHelper('set', response.User.username);
            router.go(urls.base);
          } else if (response.Code === 400 || response.Code === 500) {
            const lowestInputDiv = inputs[1] as HTMLDivElement;
            this.renderError(lowestInputDiv, response.error);
          }
        });
      }
    });

    const registerButton = document.getElementById('signup-button') as HTMLButtonElement;
    registerButton.addEventListener('click', () => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;