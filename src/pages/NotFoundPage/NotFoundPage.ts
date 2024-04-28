import Header from '@components/Header/Header';
import Button from '@components/Button/Button';
import  { router } from '@router/router';
import urls from '@router/urls';
import Base from '@components/Base/Base';
import template from '@templates/NotFoundPage.hbs';


class NotFoundPage extends Base {

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  render() {
    this.preRender();
    document.body.style.backgroundImage = '';
    
    const header = document.getElementById('header') as HTMLDivElement;
    const notfound = document.getElementById('notfound') as HTMLDivElement;
    new Header(header).render();
    new Button(notfound, {
      id: 'back-button', label: 'На главную', 
    }).render();

    const backButton = document.getElementById('back-button') as HTMLButtonElement;
    backButton.addEventListener('click', () => {
      router.go(urls.base);
    });
  }
}

export default NotFoundPage;
