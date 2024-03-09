class Router {

    constructor() {
        this.previousState = null;
        this.routes = [];
        window.addEventListener('popstate', () => this.navigate());
    }

    route(path, page) {
        this.routes.push({path, page});
    }

    navigate(path) {
       
        const currentPath = window.history.state?.path;

        console.log(currentPath);

        if (path === currentPath) {
            this.changeLocation();
            return;
        }
       
        this.changeLocation();
    }

    go(path) {
        history.pushState({}, '', path);
        this.navigate(path);
    }

    changeLocation() {
        const path = window.location.pathname;
        const route = this.routes.find((route) => route.path === path);

        const content = document.getElementById('content');
        content.innerHTML = "";

        if (route) {
            const page = new route.page.page(content);
            page.render();
            return;
        } else {
            // const notFoundPage = new notFoundPage(component);
            // notFoundPage.render();
        }
    }
}

export const router = new Router();