import template from './RegistrationForm.hbs';

import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Link from '../../Header/Link/Link'
import Main from '../../../pages/Main/Main'

class RegistrationForm {
  constructor(parent, display) {
    this.parent = parent;
    this.display = display;
  }

  getHTML() {
    return template(this.display);
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    const registrationForm = document.getElementById('registration-form');
    new Input(registrationForm, { field: 'username-register', type: 'text', placeholder: 'Логин', className: 'form-input' }).render();
    new Input(registrationForm, { field: 'username-password', type: 'password', placeholder: 'Пароль', className: 'form-input' }).render();
    new Button(registrationForm, { id: 'register-button', label: 'Зарегистрироваться', type: 'submit' }).render();

   registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username-register').value;
      const password = document.getElementById('username-password').value;
  
      fetch('http://jantugan.ru/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => {
           if (data.Code != null) {
            new Link(registrationForm, {className : 'err-lin1k', label: data.error}).render()
          } else {
            const root = document.getElementById('root');
            root.innerHTML = ''
            console.log(data)
            localStorage.setItem('username', data.User.username)
            sessionStorage.setItem('sessionID', data.SessionID)
            new Main(document.getElementById('root')).render();
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  });
  }
}

export default RegistrationForm;
