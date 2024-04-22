import SignupForm from './SignupForm/SignupForm';
import Base from '@components/Base/Base';
import template from '@templates/SignupPage.hbs';

/**
* Класс SignupPage представляет страницу регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupPage extends Base {
  /**
  * Рендерит страницу регистрации в DOM, включая форму регистрации.
  */

  constructor(parent: HTMLElement) {
    super(parent, template);
  }
  
  render() {
    this.preRender();
    document.body.classList.add('auth-background');
    new SignupForm(this.parent).render();
  }
}

export default SignupPage;
