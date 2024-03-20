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

  clearError(parent) {
    const errorMessage = parent.querySelectorAll('.err-label')[0];
    errorMessage.innerHTML = '';
    errorMessage.classList.remove('has-error');
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
