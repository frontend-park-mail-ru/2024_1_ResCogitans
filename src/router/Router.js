class Router {
  constructor() {
    this.previousState = null;
    this.routes = [];
    window.addEventListener('popstate', () => this.navigate());
  }

  route(path, page) {
    this.routes.push({ path, page });
    return this;
  }

  navigate(path) {
    const currentPath = window.history.state?.path;

    if (path === currentPath) {
      this.changeLocation();
      return;
    }

    this.changeLocation();
  }

  go(path) {
    window.history.pushState({}, '', path);
    this.navigate(path);
  }

  changeLocation() {
    const path = window.location.pathname;
    const matchRoute = this.routes.find((route) => route.path === path);

    const content = document.getElementById('content');
    content.innerHTML = '';

    if (matchRoute) {
      const page = new matchRoute.page.page(content);
      page.render();
    } else {
      // const notFoundPage = new notFoundPage(component);
      // notFoundPage.render();
    }
  }
}
const router = new Router();
export default router;
