import LoginForm from './LoginForm/LoginForm';
import Base from '../../components/Base/Base'

/**
* Класс LoginPage представляет страницу входа, которая может быть отрендерена в HTML.
* @class
*/
class LoginPage extends Base {
  /**
  * Рендерит страницу входа в DOM, включая форму входа.
  */
  async render() {
    document.body.style.backgroundImage = 'url(\'../../static/bglogin.webp\')';
    new LoginForm(this.parent).render();
  }
}

export default LoginPage;
