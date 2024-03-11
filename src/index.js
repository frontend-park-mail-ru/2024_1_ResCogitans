import { router } from './router/Router';
import urls from './router/urls';
import routes from './router/routes';

let root = document.getElementById('root');

if (root === null) {
  root = document.createElement('div', { id: 'root' });
}

let startingPath;
router.register(routes);
router.go(window.location.pathname);
