import { validate } from '../../utils/validation'

class BaseForm {
  /**
    * Создает новый экземпляр формы входа.
    * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена форма входа.
    */
  constructor(parent) {
    this.parent = parent;
  }

  renderError(parent, message) {
    const errorMessage = parent.querySelectorAll('.err-label')[0];
    if (message !== undefined && message !== null) {
      errorMessage.innerHTML = message;
      errorMessage.classList.add('has-error');
    }
  }

  enableSubmitButton = (() => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repeatPassword = document.getElementById('password-repeat');
    const submitButton = document.getElementById('login-button');

    const isValidEmail = (validate({ string: email.value, type: email.type }) === undefined);
    const isValidPassword = (validate({ string: password.value, type: password.type }) === undefined);
    const passwordsMatch = password.value === repeatPassword.value;
    !passwordsMatch ? this.renderError(repeatPassword.parentElement, 'Пароли не совпадают')
      : this.clearError(repeatPassword.parentElement);

    submitButton.disabled = !(isValidEmail && isValidPassword && passwordsMatch);
  });

  clearError(parent) {
    const errorMessage = parent.querySelectorAll('.err-label')[0];
    errorMessage.innerHTML = '';
    errorMessage.classList.remove('has-error');
  }

  enablePasswordVisibilityButtons() {
    document.querySelectorAll('.input-button').forEach((input) => input.children[2].addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePasswordVisibility(input);
    }));
  }

  togglePasswordVisibility(inputWithButton) {
    const icons = inputWithButton.querySelectorAll('img');
    if (inputWithButton.children[1].type === 'password') {
      inputWithButton.children[1].type = 'text';
      icons.forEach((icon) => icon.src = 'static/no_visible.svg');
    } else {
      inputWithButton.children[1].type = 'password';
      icons.forEach((icon) => icon.src = 'static/visible.svg');
    }
  }
}

export default BaseForm;
