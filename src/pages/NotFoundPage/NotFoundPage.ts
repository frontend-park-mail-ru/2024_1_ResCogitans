import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import  { router } from '../../router/router';
import urls from '../../router/urls';
import Base from '../../components/Base/Base';
import template from './NotFoundPage.hbs'

class NotFoundPage extends Base {
  async render() {
    document.body.style.backgroundImage = '';
      const htmlView = this.template(this);
        this.parent.insertAdjacentHTML('beforeend', htmlView);
    const header = document.getElementById('header') as HTMLDivElement;
    const notfound = document.getElementById('notfound') as HTMLDivElement;
    new Header(header).render();
    new Button(notfound, { id: 'back-button', label: 'На главную' }).render();

    const backButton = document.getElementById('back-button') as HTMLButtonElement;
    backButton.addEventListener('click', () => {
      router.go(urls.base);
    });
  }
}

export default NotFoundPage;
