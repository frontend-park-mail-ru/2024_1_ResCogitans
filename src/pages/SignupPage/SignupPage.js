import template from './SignupPage.hbs';
import SignupForm from './SignupForm/SignupForm';

class SignupPage {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template();
  }

  render() {
    document.body.style.backgroundImage = 'url(\'../../static/bglogin.webp\')';
    new SignupForm(this.parent).render();
  }
}

export default SignupPage;
