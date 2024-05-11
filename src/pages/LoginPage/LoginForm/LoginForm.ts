import Button from '@components/Button/Button';
import urls from '@router/urls';
import Logo from '@components/Logo/Logo';
import  { router } from '@router/router';
import { addUserToLocalStorage } from '@utils/localstorage';
import { authorize } from '@api/user';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { loginErrors } from '../../../types/errors';
import { UserAuthResponseData } from '@types/api';
import template from '@templates/LoginForm.hbs';

/**
* Класс LoginForm представляет форму входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginForm extends AuthorizationForm {


  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  render() {
    this.preRender();
    
    const logoGroup = document.getElementById('logo-group') as HTMLDivElement;
    new Logo(logoGroup).render();
    const loginForm = document.getElementById('login-form') as HTMLDivElement;

    new Button(loginForm, {
      id: 'button-submit', label: 'Войти', type: 'submit',
    }).render();
    
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    this.enablePasswordVisibilityButtons();

    const submitButton = document.getElementById('button-submit') as HTMLButtonElement;

    
    new Button(loginForm, {
      id: 'signup-button', label: 'Регистрация',
    }).render();
   
    const lowestInputDiv = passwordInput.parentElement as HTMLDivElement;

    const inputs = loginForm.querySelectorAll('input');

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

    submitButton.addEventListener('click', (e : Event) => {
      e.preventDefault();
      if (this.errorsInForm()) return;
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      authorize('login', requestBody)
        .then((response) => {
          const responseData = response.data as UserAuthResponseData;
          if (response.status === 200) {
            if (responseData.user.id === 0) {
              this.renderError(lowestInputDiv, loginErrors[500]);
              return;
            }
            const responseID = responseData.user.id;
            const responseUsername = responseData.user.username;
            addUserToLocalStorage(responseUsername, responseID);
            document.body.classList.remove('auth-background');
            router.goBack();
          } else if (response.status === 400 || response.status === 500) {
            this.renderError(lowestInputDiv, loginErrors[response.status]);
          }
        });
    });

    const registerButton = document.getElementById('signup-button') as HTMLButtonElement;
    registerButton.addEventListener('click', () => {
      router.go(urls.signup);
    });
  }
}

export default LoginForm;
