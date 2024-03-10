import routes from './routes'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'

/**
* Класс Router управляет навигацией между страницами приложения.
* @class
*/
class Router {
  /**
  * Создает новый экземпляр маршрутизатора.
  * @constructor
  */
  constructor() {
    this.previousState = null;
    this.routes = [];
    window.addEventListener('popstate', () => this.changeLocation());
  }

  register(routes) {
    Object.entries(routes).forEach(([path, page]) => {
      this.route(path, page);
    });
  }

  /**
  * Добавляет новый маршрут в маршрутизатор.
  * @param {string} path - Путь маршрута.
  * @param {Object} page - Объект страницы, связанный с маршрутом.
  * @returns {Router} Ссылку на текущий экземпляр маршрутизатора.
  */
  route(path, page) {
    this.routes.push({ path, page });
    return this;
  }

  /**
  * Перенаправляет пользователя на указанный путь и обновляет историю браузера.
  * @param {string} path - Путь для перенаправления.
  */
  go(path) {
    history.pushState({}, '', path);
    this.changeLocation();
  }

  clearContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';
  }

  changeLocation() {
    const path = window.location.pathname;
    const route = this.routes.find((route) => route.path === path);

    this.clearContent();

    if (route) {
      const page = new route.page(content);
      page.render();
    } else {
      const notFoundPage = new NotFoundPage(content);
      notFoundPage.render();
    }
  }
}

export const router = new Router();
