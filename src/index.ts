import { router } from '@router/router';

let root = document.getElementById('root') as HTMLDivElement;

if (root === null) {
  root = document.createElement('div') as HTMLDivElement;
  root.id = 'root';
}

router.go(window.location.pathname);

// document.addEventListener('click', (e) => {
//   alert('intecepted');
//   let href: string;

//   if (e.target.tagName === 'A') {
//     e.preventDefault();
//     href = e.target.getAttribute('href');
//   } else if (e.target.parent) {
//     if (e.target.parent.tagName === 'A') {
//       href = e.target.parent.getAttribute('href');
//     }
//   }

//   router.go(href);
// });
