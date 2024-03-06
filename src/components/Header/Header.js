import Button from '../Button/Button';
import Logo from './Logo/Logo';
import Link from './Link/Link';
import LoginForm from './LoginForm/LoginForm';
import Main from '../../pages/Main/Main'

import template from './Header.hbs';

const user = false;

class Header {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return template();
  }

  renderLinkBlock(parent, labels) {
    labels.forEach((label) => new Link(parent, { label }).render());
  }

  render() {
    const logoGroup = document.getElementById('logo-group');
    const logo = new Logo(logoGroup);
    logo.render();

    const linkBlock = document.getElementById('links');
    this.renderLinkBlock(linkBlock, ['Альбомы', 'Отзывы', 'Поддержка']);

    const buttonGroup = document.getElementById('button-group');
    const currencyButton = new Button(buttonGroup, { id: 'button-region', img: '../../static/globe.svg' });
    currencyButton.render();

    const profileBlock = document.getElementById('button-group');
    const username = localStorage.getItem('username')

    if (username != "") {
      const profile = new Link(profileBlock, {className: 'user-link', label : username}).render()
      const logout = new Button(profileBlock, {id: 'logout', className: 'login-group-button', label: 'Выйти'}).render();

      logout.addEventListener('click', (e) => {
          localStorage.setItem('username', "")
          const root = document.getElementById('root');
          root.innerHTML = ''
          sessionStorage.setItem['SessionID', ""]
          new Main(document.getElementById('root')).render();
      })
    } else {
      const loginButton = new Button(profileBlock, { id: 'button-login', label: 'Войти' });
      loginButton.render();
      let state = 0;
      document.getElementById('button-login').addEventListener('click', (e) => {
        const body = document.getElementById('root');
        const form = new LoginForm(body, { display: 'flex' });
        switch (state) {
          case 0:
            form.render();
            state = 1;
            break;
          case 1:
            body.removeChild(body.children[4]);
            state = 0;
            break;
          default:
            state = 0;
        }
      }, false);
    }
  }
}

export default Header;
