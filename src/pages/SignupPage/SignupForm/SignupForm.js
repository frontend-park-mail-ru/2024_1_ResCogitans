import template from './SignupForm.hbs';
import AuthorizationForm from '../../../components/Form/AuthorizationForm';
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
class SignupForm extends AuthorizationForm {
  /**
    * Возвращает HTML-представление формы входа.
    * @returns {string} HTML-представление формы входа.
    */
  asHTML() {
    return template(this.display);
  }

  /**
  * Рендерит форму регистрации в DOM, включая логотип, поля ввода и кнопку.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();

    this.enablePasswordVisibilityButtons();

    const registrationForm = document.getElementById('registration-form');
    new Button(registrationForm, { id: 'login-button', label: 'Зарегистрироваться', type: 'submit' }).render();
    const submitButton = document.getElementById('login-button');
    submitButton.disabled = true;

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repeatPassword = document.getElementById('password-repeat');

    document.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => {
      validate({ string: input.value, type: input.type })
        .catch((error) => {this.renderError(input.parentElement, error.message)})
        .then(() => {
          this.enableSubmitButton();
        });
        this.clearError(input.parentElement);
    }));

    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requestBody = {
        username: email.value,
        password: password.value,
      };
      signup('http://127.0.0.1:8080', requestBody)
        .then((response) => {
          if (response.status === 200) {
            userHelper('set', response.data.User.username);
            router.go(urls.base);
          }
          if (response.status === 400 || response.status === 500) {
            this.renderError(repeatPassword.parentElement, response.data.error);
          }
        }
    )});
  }
}

export default SignupForm;
