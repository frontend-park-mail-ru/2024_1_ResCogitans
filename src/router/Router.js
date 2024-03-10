import urls from './urls';

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
    window.addEventListener('popstate', () => this.navigate());
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
  * Перенаправляет пользователя на указанный путь.
  * @param {string} [path] - Путь для редиректа. Если путь не указан, используется текущий путь.
  */
  navigate(path) {
    const currentPath = window.history.state?.path;

    if (path === currentPath) {
      this.changeLocation();
      return;
    }

    this.changeLocation();
  }

  /**
  * Перенаправляет пользователя на указанный путь и обновляет историю браузера.
  * @param {string} path - Путь для перенаправления.
  */
  go(path) {
    history.pushState({}, '', path);
    this.navigate(path);
  }

  /**
  * Обрабатывает изменение местоположения, отображая соответствующую страницу.
  */
  changeLocation() {
    const path = window.location.pathname;
    const route = this.routes.find((route) => route.path === path);

    const content = document.getElementById('content');
    content.innerHTML = '';

    if (route) {
      const page = new route.page.page(content);
      page.render();
    } else {
      // const notFoundPage = new notFoundPage(component);
      // notFoundPage.render();
    }
  }
}

export const router = new Router();
