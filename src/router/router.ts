import urls from '@router/urls';
import LoginPage from '@pages/LoginPage/LoginPage';
import PlacesPage from '@pages/PlacesPage/PlacesPage';
import SignupPage from '@pages/SignupPage/SignupPage';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import SightPage from '@pages/SightPage/SightPage';

const routesList = {
  [urls.base]: PlacesPage,
  [urls.signup]: SignupPage,
  [urls.login]: LoginPage,
  [urls.notfound]: NotFoundPage,
  [urls.profile]: ProfilePage,
  [urls.sight]: SightPage,
};

interface Page {
  render: () => void;
}
 
type Routes = Record<string, new (content: HTMLElement, username?: string) => Page>;

/**
* Класс Router управляет навигацией между страницами приложения.
* @class
*/
class Router {

  routes : Routes;

  /**
  * Создает новый экземпляр маршрутизатора.
  * @constructor
  */
  constructor(routes: Routes) {
    this.routes = routes;
    window.addEventListener('popstate', () => this.changeLocation());
  }

  
  route(path: string, PageConstructor: new (content: HTMLElement, username? : string) => Page) {
    this.routes[path] = PageConstructor;
    return this;
  }

  /**
  * Перенаправляет пользователя на указанный путь и обновляет историю браузера.
  * @param {string} path - Путь для перенаправления.
  */
  go(path: string) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    this.changeLocation();
  }

  goBack() {
    window.history.back();
  }
   

  clearContent() {
    let content = document.getElementById('content');
    if (!content) {
      content = document.createElement('div');
      content.id = 'content';
      const root = document.getElementById('root') as HTMLDivElement;
      root.appendChild(content);
    }
    content.innerHTML = '';
    return content;
  }

  changeLocation() {
    let path = window.location.pathname;
    const PageConstructorFromRoutes = this.routes[path.split('/')[1]];
    const content = this.clearContent();

    if (PageConstructorFromRoutes) {
      let page;
      if (path.startsWith(`/${urls.profile}`)) {
        page = new PageConstructorFromRoutes(content);
      } else if (path.startsWith(`/${urls.sight}`)) {
        page = new PageConstructorFromRoutes(content);
      } else {
        page = new PageConstructorFromRoutes(content);
      }
      page?.render();
    } else {
      const PageConstructorNotFound = this.routes['404'];
      if (PageConstructorNotFound) {
        new PageConstructorNotFound(content).render();
      }
    }
  }
}

const router = new Router(routesList);
export { router };
