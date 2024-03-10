import Button from '../Button/Button';
import Logo from './Logo/Logo';
import Link from './Link/Link';
import PlacesPage from '../../pages/PlacesPage/PlacesPage'
import urls from '../../router/urls'
import { router } from '../../router/Router'

import template from './Header.hbs';

const user = false;

class Header {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template();
  }

  renderLinkBlock(parent, labels) {
    labels.forEach((label) => new Link(parent, { label }).render());
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    
    const logoGroup = document.getElementById('logo-group');
    const logo = new Logo(logoGroup);
    logo.render();

    // const linkBlock = document.getElementById('links');
    // this.renderLinkBlock(linkBlock, ['Альбомы', 'Отзывы', 'Поддержка']);

    const buttonGroup = document.getElementById('button-group');
    // const currencyButton = new Button(buttonGroup, { id: 'button-region', img: '../../static/globe.svg' });
    // currencyButton.render();

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
          new PlacesPage(document.getElementById('root')).render();
      })
    } else {
      const loginButton = new Button(profileBlock, { id: 'button-login', label: 'Войти' });
      loginButton.render();
      let state = 0;
      document.getElementById('button-login').addEventListener('click', () => {
        router.go(urls.login);
      })
    }
  }
}

export default Header;
