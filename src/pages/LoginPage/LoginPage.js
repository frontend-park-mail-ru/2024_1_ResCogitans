import template from './LoginPage.hbs'
import LoginForm from './LoginForm/LoginForm'

class LoginPage {

    constructor(parent) {
        this.parent = parent
    }

    asHTML() {
        return template();
    }

    render() {
        document.body.style.backgroundImage = `url('../../static/bglogin.webp')`;
        new LoginForm(this.parent).render();
    }
}

export default LoginPage;