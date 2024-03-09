import template from './SignupForm.hbs';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Link from '../../../components/Header/Link/Link'
import PlacesPage from '../../PlacesPage/PlacesPage'
import Logo from '../../../components/Header/Logo/Logo'

class SignupForm {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template(this.display);
  }

  render() {

    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const logoGroup = document.getElementById('logo-group');
    new Logo(logoGroup).render();

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
            new PlacesPage(document.getElementById('root')).render();
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  });
  }
}

export default SignupForm;
