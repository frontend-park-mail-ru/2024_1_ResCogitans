import Main from './pages/Main/Main';

// routing

const root = document.getElementById('root');

if (root === null) {
  const newRoot = document.createElement('div', { id: 'root' });
  new Main(newRoot).render();
} else {
  new Main(root).render();
}
