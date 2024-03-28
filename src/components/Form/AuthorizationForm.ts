import Base from '../Base/Base'

class AuthorizationForm extends Base {

  renderError(parent : HTMLElement, message : string) {
    const errorMessage = parent.querySelectorAll('.err-label')[0] as HTMLElement;
    if (message !== undefined && message !== null) {
      errorMessage.innerHTML = message;
      errorMessage.classList.add('has-error');
    }
  }

  email = document.getElementById('email');

  password = document.getElementById('password');

  enableSubmitButton = (() => {
    const submitButton : HTMLButtonElement | null = document.getElementById('login-button') as HTMLButtonElement;
    const errorMessages : NodeListOf<HTMLElement> = document.querySelectorAll('.has-error');
    const hasErrors : boolean = (errorMessages.length > 0);
    if (submitButton !== null) {
      submitButton.disabled = hasErrors;
    }
  });

  clearError(parent : HTMLElement) {
    const errorMessage = parent.querySelectorAll('.err-label')[0] as HTMLElement;
    errorMessage.innerHTML = '';
    errorMessage.classList.remove('has-error');
  }

  enablePasswordVisibilityButtons() {
    document.querySelectorAll('.input-button').forEach((input) => {
      input.querySelector('button')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePasswordVisibility(input as HTMLElement);
    })});
  }

  togglePasswordVisibility(inputWithButton : HTMLElement) {
    const icon = inputWithButton.querySelector('img');
    const inputElement = inputWithButton.children[1] as HTMLInputElement;
   
    if (inputElement.type === 'password') {
      inputElement.type = 'text';
      icon?.classList.replace('password-invisible', 'password-visible');
     } else {
      inputElement.type = 'password';
      icon?.classList.replace('password-visible', 'password-invisible');
    }
  }
}

export default AuthorizationForm;
