import Base from '@components/Base/Base';

class AuthorizationForm extends Base {

  renderError(parent : HTMLElement, message : string) {
    const errorMessage = parent.querySelector('.err-label') as HTMLElement;
    if (message !== undefined && message !== null) {
      errorMessage.innerHTML = message;
      errorMessage.classList.add('has-error');
    }
  }

  email = document.getElementById('email') as HTMLInputElement;

  password = document.getElementById('password') as HTMLInputElement;
  
  enableSubmitButton = (() => {
    const submitButton : HTMLButtonElement | null = document.getElementById('button-submit') as HTMLButtonElement;
    const errorMessages : NodeListOf<HTMLElement> = document.querySelectorAll('.has-error');
    const forms : NodeListOf<HTMLInputElement> = document.querySelectorAll('input');
    let areEmptyForms : boolean = false;
    forms.forEach((form) => {
      if (form.value.length === 0) {
        areEmptyForms = true;
        return;
      }
    });
    const hasErrors : boolean = (errorMessages.length > 0);
    submitButton.disabled = (hasErrors || areEmptyForms) ;
  });

  clearError(parent : HTMLElement) {
    const errorMessage = parent.querySelectorAll('.err-label')[0] as HTMLElement;
    if (errorMessage !== undefined) {
      errorMessage.innerHTML = '';
      errorMessage.classList.remove('has-error');
    }
  }

  enablePasswordVisibilityButtons() {
    document.querySelectorAll('.input-button').forEach((input) => {
      input.querySelector('button')?.addEventListener('click', (e : Event) => {
        e.preventDefault();
        this.togglePasswordVisibility(input as HTMLElement);
      });
    });
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
      inputElement.type = 'password';
      icon?.classList.replace('password-visible', 'password-invisible');
    }
  }
}

export default AuthorizationForm;
