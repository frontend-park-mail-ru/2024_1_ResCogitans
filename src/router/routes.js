import urls from './urls'
import LoginPage from '../pages/LoginPage/LoginPage'
import PlacesPage from '../pages/PlacesPage/PlacesPage'
import SignupPage from '../pages/SignupPage/SignupPage'

const routes = {
    [urls.sights]: {
        page: PlacesPage,
    },
    [urls.signup]: {
        page: SignupPage,
    },
    [urls.login]: {
        page: LoginPage,
    },
};


export { routes };