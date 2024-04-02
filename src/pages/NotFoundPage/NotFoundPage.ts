import Header from '@components/Header/Header';
import Button from '@components/Button/Button';
import  { router } from '@router/router';
import urls from '@router/urls';
import Base from '@components/Base/Base';

class NotFoundPage extends Base {
  async render() {
    document.body.style.backgroundImage = '';
    await this.preRender();

    const header = document.getElementById('header') as HTMLDivElement;
    const notfound = document.getElementById('notfound') as HTMLDivElement;
    await new Header(header).render();
    await new Button(notfound, { id: 'back-button', label: 'На главную' }).render();

    const backButton = document.getElementById('back-button') as HTMLButtonElement;
    backButton.addEventListener('click', () => {
      router.go(urls.base);
    });
  }
}

export default NotFoundPage;
