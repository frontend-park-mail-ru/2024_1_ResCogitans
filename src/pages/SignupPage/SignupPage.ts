import SignupForm from './SignupForm/SignupForm';
import Base from '@components/Base/Base';

/**
* Класс SignupPage представляет страницу регистрации, которая может быть отрендерена в HTML.
* @class
*/
class SignupPage extends Base {
  /**
  * Рендерит страницу регистрации в DOM, включая форму регистрации.
  */
  async render() {
    await new SignupForm(this.parent).render();
  }
}

export default SignupPage;
