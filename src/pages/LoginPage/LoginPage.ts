import LoginForm from './LoginForm/LoginForm';
import Base from '@components/Base/Base';
import template from '@templates/LoginPage.hbs';


/**
* Класс LoginPage представляет страницу входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginPage extends Base {

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  /**
  * Рендерит страницу входа в DOM, включая форму входа.
  */
  render() {
    this.preRender();
    
    document.body.classList.add('auth-background');
    new LoginForm(this.parent).render();
  }
}

export default LoginPage;
