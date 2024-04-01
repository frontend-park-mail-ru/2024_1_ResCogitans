import AuthorizationForm from '@components/Form/AuthorizationForm';
import Button from '@components/Button/Button';
import urls from '@router/urls';
import Logo from '@components/Logo/Logo';
import { authorize } from '@api/user';
import { router } from '@router/router';
import { userHelper } from '@utils/localstorage';
import { validate } from '@utils/validation';
import { signupErrors } from '../../../types/errors';

/**
* Класс SignupForm представляет форму регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupForm extends AuthorizationForm {
  /**
  * Рендерит форму регистрации в DOM, включая логотип, поля ввода и кнопку.
  */
  async render() {
    await this.preRender();

    const logoGroup = document.getElementById('logo-group') as HTMLDivElement;
    await new Logo(logoGroup).render();

    this.enablePasswordVisibilityButtons();

    const registrationForm = document.getElementById('registration-form') as HTMLDivElement;
    await new Button(registrationForm, { id: 'login-button', label: 'Зарегистрироваться', type: 'submit' }).render();
    const submitButton = document.getElementById('login-button') as HTMLButtonElement;
    submitButton.disabled = true;

    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const repeatPassword = document.getElementById('password-repeat') as HTMLInputElement;

    const form = document.querySelector('form') as HTMLFormElement;

    form.addEventListener('input', (e: Event) => {
      const input = e.target as HTMLInputElement; 
      const parent = input.parentElement as HTMLElement;
      validate( input.value, input.type )
        .catch((error) => { this.renderError(parent, error.message); })
        .then(() => {
          this.enableSubmitButton();
        });
      this.clearError(parent);
      }
    );

    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requestBody = {
        username: email?.value,
        password: password?.value,
      };

      const lowestInput = repeatPassword.parentElement as HTMLDivElement;
      authorize('signup', requestBody)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200) {
            userHelper('set', responseData.username);
            router.go(urls.base);
          }
          if (response.status === 400 || response.status === 500) {
            this.renderError(lowestInput, signupErrors[responseData.error]);
          }
        });
    });
  }
}

export default SignupForm;
