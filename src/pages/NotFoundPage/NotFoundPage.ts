import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { router } from '../../router/Router';
import urls from '../../router/urls';

import template from './NotFoundPage.hbs';

class NotFoundPage {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template(this);
  }

  render() {
    document.body.style.backgroundImage = '';
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());
    const header = document.getElementById('header');
    const notfound = document.getElementById('notfound');
    new Header(header).render();
    new Button(notfound, { id: 'back-button', label: 'На главную' }).render();

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
      router.go(urls.base);
    });
  }
}

export default NotFoundPage;
