import template from './SignupForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Link from '../../../components/Header/Link/Link'
import urls from '../../../router/urls'
import Logo from '../../../components/Header/Logo/Logo'
import { signup } from '../../../api/api'
import { router } from '../../../router/Router'

/**
* Класс SignupForm представляет форму регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupForm {
  /**
  * Создает новый экземпляр формы регистрации.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена форма регистрации.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Возвращает HTML-представление формы регистрации.
  * @returns {string} HTML-представление формы регистрации.
  */
  asHTML() {
    return template(this.display);
  }

  /**
  * Отображает ошибку или перенаправляет пользователя в зависимости от ответа сервера.
  * @param {Object} response - Ответ сервера.
  */
  displayErrorOrRedirect(response) {
    if (response.Code == null) {
      localStorage.setItem('username', response.User.username);
      router.go(urls.sights);
    } else {
      const registrationForm = document.getElementById('registration-form');
      document.getElementById('form-error')?.remove();
      new Link(registrationForm, {id: 'form-error', className: "err-link", label: response.error}).render();
    }
  }

  /**
  * Рендерит форму регистрации в DOM, включая логотип, поля ввода и кнопку.
  */
  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();

    const registrationForm = document.getElementById('registration-form');
    new Input(registrationForm, { field: 'username-register', type: 'text', placeholder: 'Логин', className: 'form-input' }).render();
    new Input(registrationForm, { field: 'username-password', type: 'password', placeholder: 'Пароль', className: 'form-input' }).render();
    new Button(registrationForm, { id: 'login-button', label: 'Зарегистрироваться', type: 'submit' }).render();

   registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username-register').value;
      const password = document.getElementById('username-password').value;
  
      signup('http://jantugan.ru', {username: username, password: password}, this.displayErrorOrRedirect.bind(this));
  });
  }
}

export default SignupForm;
