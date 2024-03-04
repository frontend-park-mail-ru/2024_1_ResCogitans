import Button from '../Button';
import Logo from './Logo';
import Link from './Link';
// import Profile from '../Profile/'

import template from './Header.hbs';

import LoginForm from './LoginForm';

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

    if (user) {
      // const profile = new Profile(profileBlock)
      // profile.render();
    } else {
      const loginButton = new Button(profileBlock, { id: 'button-login', label: 'Войти' });
      loginButton.render();
      let state = 0;
      document.getElementById('button-login').addEventListener('click', (e) => {
        const body = document.getElementById('root');
        switch (state) {
          case 0:
            const form = new LoginForm(body, { display: 'flex' });
            form.render();
            state = 1;
            break;
          case 1:
            body.removeChild(body.children[4]);
            console.log(body.childNodes);
            state = 0;
            break;
        }
      }, false);
    }
  }
}

export default Header;
