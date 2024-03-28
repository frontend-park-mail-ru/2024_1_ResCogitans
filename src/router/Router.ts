import routes from './routes'

interface Page {
  render: () => void;
 }
 
 type Routes = Record<string, new (content: HTMLElement) => Page>;

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

  /**
  * Добавляет новый маршрут в маршрутизатор.
  * @param {string} path - Путь маршрута.
  * @param {Object} page - Объект страницы, связанный с маршрутом.
  * @returns {Router} Ссылку на текущий экземпляр маршрутизатора.
  */
  route(path: string, PageConstructor: new (content: HTMLElement) => Page) {
    this.routes[path] = PageConstructor;
    return this;
 }

  /**
  * Перенаправляет пользователя на указанный путь и обновляет историю браузера.
  * @param {string} path - Путь для перенаправления.
  */
  go(path : string) {
    window.history.pushState({}, '', path);
    this.changeLocation();
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
    const path = window.location.pathname;
    const PageConstructor = this.routes[path];
    const content = this.clearContent();

    if (PageConstructor) {
      const page = new PageConstructor(content);
      page.render();
    } else {
      const PageConstructor = this.routes['/404'];
      if (PageConstructor) {
        new PageConstructor(content).render();
      }
    }
 }
}

export const router = new Router(routes);
