import { router } from './router/Router';
import { routes } from './router/routes';
import urls from './router/urls';

let root = document.getElementById('root');

if (root === null) {
  root = document.createElement('div', { id: 'root' });
}

Object.entries(routes).forEach(([path, page]) => {
  router.route(path, page);
});

let startingPath;
console.log(window.location.pathname);

if (window.location.pathname === urls.base) {
  startingPath = urls.sights;
} else {
  startingPath = window.location.pathname;
  console.log(startingPath);
}

router.go(startingPath);
