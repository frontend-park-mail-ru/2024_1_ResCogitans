import template from './SignupForm.hbs';
import BaseForm from '../../../components/Form/FormBase';
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
class SignupForm extends BaseForm {
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

    let password;
    let repeatPassword;
    const inputs = document.querySelectorAll('.input');

    inputs.forEach((input) => input.children[1].addEventListener('focusout', (e) => {
     // TODO: нормально написать логику
    }));
    

    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (document.querySelectorAll('.has-error').length > 0) {
        return;
      }
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      signup('http://127.0.0.1:8080', requestBody)
        .then((response) => {
          if (response.Code === undefined) {
            userHelper('set', response.User.username);
            router.go(urls.base);
          } else if (response.Code === 400 || response.Code == 500) {
            this.renderError(inputs[2], response.error);
          }
        });
    });
  }
}

export default SignupForm;
