import Main from './pages/Main/Main';

// routing

let sessionCookie

document.addEventListener('DOMContentLoaded', function() {
    sessionCookie = document.cookie.split('; ').find(row => row.startsWith('session='));
    let root = document.getElementById('root');
  
    if (root === null) {
      root = document.createElement('div', { id: 'root' });
    }
    new Main(root, sessionCookie).render();
});


