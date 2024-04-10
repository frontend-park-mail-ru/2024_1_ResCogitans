import Button from '@components/Button/Button';
import urls from '@router/urls';
import Logo from '@components/Logo/Logo';
import  { router } from '@router/router';
import { userHelper } from '@utils/localstorage';
import { authorize } from '@api/user';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { loginErrors } from '../../../types/errors';

/**
* Класс LoginForm представляет форму входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginForm extends AuthorizationForm {

  async render() {
    await this.preRender();

    const logoGroup = document.getElementById('logo-group') as HTMLDivElement;
    await new Logo(logoGroup).render();
    const loginForm = document.getElementById('login-form') as HTMLDivElement;

    await new Button(loginForm, {
      id: 'button-submit', label: 'Войти', type: 'submit',
    }).render();
    await new Button(loginForm, {
      id: 'signup-button', label: 'Регистрация',
    }).render();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    this.enablePasswordVisibilityButtons();

    const submitButton = document.getElementById('button-submit') as HTMLButtonElement;
    submitButton.disabled = true;
    
    const lowestInputDiv = passwordInput.parentElement as HTMLDivElement;

    loginForm.addEventListener('input', (e: Event) => {
      const input = e.target as HTMLInputElement; 
      const parent = input.parentElement as HTMLElement;
      validate( input.value, input.type )
        .catch((error) => { this.renderError(parent, error.message); })
        .then(() => {
          this.enableSubmitButton();
        });
      this.clearError(parent);
    },
    );

    loginForm.addEventListener('click', () => {
      const elementsWithError = document.querySelectorAll('.has-error');
      elementsWithError.forEach(element => {
        element.classList.remove('has-error');
      });
    }); 

    loginForm.addEventListener('submit', (e : Event) => {
      e.preventDefault();
      const requestBody = {
        username: emailInput.value,
        password: passwordInput.value,
      };
      authorize('login', requestBody)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200) {
            userHelper('set', responseData.user?.username.split('@')[0]); 
            localStorage.setItem('userID', responseData.user?.id);
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
