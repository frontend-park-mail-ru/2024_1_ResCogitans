import AuthorizationForm from '@components/Form/AuthorizationForm';
import Button from '@components/Button/Button';
import Logo from '@components/Logo/Logo';
import { authorize } from '@api/user';
import { addUserToLocalStorage } from '@utils/localstorage';
import { validate } from '@utils/validation';
import { signupErrors } from '../../../types/errors';
import template from '@templates/SignupForm.hbs';

/**
* Класс SignupForm представляет форму регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupForm extends AuthorizationForm {
  /**
  * Рендерит форму регистрации в DOM, включая логотип, поля ввода и кнопку.
  */

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  render() {
    this.preRender();
    
    const logoGroup = document.getElementById('logo-group') as HTMLDivElement;
    new Logo(logoGroup).render();

    this.enablePasswordVisibilityButtons();

    const registrationForm = document.getElementById('registration-form') as HTMLFormElement;
    new Button(registrationForm, {
      id: 'button-submit', label: 'Зарегистрироваться', type: 'submit', 
    }).render();
    const submitButton = document.getElementById('button-submit') as HTMLButtonElement;

    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const repeatPassword = document.getElementById('password-repeat') as HTMLInputElement;
    const lowestInput = repeatPassword.parentElement as HTMLDivElement;
 
    const inputs = registrationForm.querySelectorAll('input');
 
    inputs.forEach((input) => input.addEventListener('blur', (e: Event) => {
      const input = e.target as HTMLInputElement; 
      const parent = input.parentElement as HTMLElement;
      const error = validate( input.value, input.type );
      if (error.length > 0) {
        this.renderError(parent, error);
      } else {
        this.clearError(parent);
      }
    },
    ));


    registrationForm.addEventListener('submit', (e : Event) => {
      e.preventDefault();

      if (password.value !== repeatPassword.value) {
        this.renderError(lowestInput, 'Пароли не совпадают');
      } else {
        this.clearError(lowestInput);
      }

      if (this.errorsInForm()) return;

      if (password.value !== repeatPassword.value) {
        this.renderError(lowestInput, 'Пароли не совпадают');
        this.errorsInForm();
        return;
      } else {
        this.clearError(lowestInput);
      }

      authorize('signup', registrationForm)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200) {
            const responseID = responseData.user?.id;
            const responseUsername = responseData.user?.username;
            if (responseID !== undefined && responseUsername !== undefined) {
              addUserToLocalStorage(responseUsername, responseID);
            }
            document.body.classList.remove('auth-background');
            document.dispatchEvent(new CustomEvent('redirect', {
              detail : {
                path : '/',
              },
            }));
          }
          if (response.status === 400 || response.status === 500) {
            this.renderError(lowestInput, signupErrors[responseData.error]);
          }
        });
    });
  }
}

export default SignupForm;
