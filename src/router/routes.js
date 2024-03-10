import urls from './urls'
import LoginPage from '../pages/LoginPage/LoginPage'
import PlacesPage from '../pages/PlacesPage/PlacesPage'
import SignupPage from '../pages/SignupPage/SignupPage'
import DocsPage from '../pages/DocsPage/DocsPage'


/**
* Объект routes содержит конфигурацию маршрутов приложения.
* Каждый ключ в объекте соответствует URL-адресу, а значение - объекту,
* содержащему класс страницы, который должен быть отображен при переходе по этому URL.
* @type {Object}
*/
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
    [urls.docs]: {
        page: DocsPage,
    },
};


export { routes };