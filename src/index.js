import { router } from './router/Router';
import routes from './router/routes';

let root = document.getElementById('root');

if (root === null) {
  root = document.createElement('div', { id: 'root' });
}

router.register(routes);
router.go(window.location.pathname);
