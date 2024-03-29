import urls from './urls';
import LoginPage from '../pages/LoginPage/LoginPage';
import PlacesPage from '../pages/PlacesPage/PlacesPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

/**
* Объект routes содержит конфигурацию маршрутов приложения.
* Каждый ключ в объекте соответствует URL-адресу, а значение - объекту,
* содержащему класс страницы, который должен быть отображен при переходе по этому URL.
* @type {Object}
*/
const routes = {
  [urls.base]: PlacesPage,
  [urls.signup]: SignupPage,
  [urls.login]: LoginPage,
  [urls.notfound]: NotFoundPage,
};

export default routes;
