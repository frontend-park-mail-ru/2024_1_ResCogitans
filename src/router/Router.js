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
    window.history.pushState({}, '', path);
    this.changeLocation();
  }

  clearContent() {
    let content = document.getElementById('content');
    if (!content) {
      content = document.createElement('div');
      content.id = 'content';
      document.getElementById('root').appendChild(content);
    }
    content.innerHTML = '';
    return content;
  }

  changeLocation() {
    const path = window.location.pathname;
    const route = this.routes.find((route) => route.path === path);
    const content = this.clearContent();

    if (route) {
      const page = new route.page(content);
      page.render();
    } else {
      const { page } = this.routes.find((obj) => obj.path === '');
      new page(content).render();
    }
  }
}

export const router = new Router();
