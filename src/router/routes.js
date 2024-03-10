import urls from './urls';
import LoginPage from '../pages/LoginPage/LoginPage';
import PlacesPage from '../pages/PlacesPage/PlacesPage';
import SignupPage from '../pages/SignupPage/SignupPage';

const routes = {
  [urls.base]: PlacesPage,
  [urls.signup]: SignupPage,
  [urls.login]: LoginPage,
};

export default routes;
