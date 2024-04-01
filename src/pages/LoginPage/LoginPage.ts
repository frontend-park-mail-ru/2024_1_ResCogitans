import LoginForm from './LoginForm/LoginForm';
import Base from '@components/Base/Base'

/**
* Класс LoginPage представляет страницу входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginPage extends Base {
  /**
  * Рендерит страницу входа в DOM, включая форму входа.
  */
  async render() {
    await this.preRender();
    await new LoginForm(this.parent).render();
  }
}

export default LoginPage;
