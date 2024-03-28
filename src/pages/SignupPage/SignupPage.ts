import template from './SignupPage.hbs';
import SignupForm from './SignupForm/SignupForm';
import Base from '../../components/Base/Base'

/**
* Класс SignupPage представляет страницу регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupPage extends Base {
  /**
  * Рендерит страницу регистрации в DOM, включая форму регистрации.
  */
  async render() {
    document.body.style.backgroundImage = 'url(\'../../static/bgsignup.jpg\')';
    new SignupForm(this.parent).render();
  }
}

export default SignupPage;
