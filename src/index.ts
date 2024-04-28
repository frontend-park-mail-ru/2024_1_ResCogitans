import { router } from '@router/router';

let root = document.getElementById('root') as HTMLDivElement;

if (root === null) {
  root = document.createElement('div') as HTMLDivElement;
  root.id = 'root';
}

router.go(window.location.pathname);
