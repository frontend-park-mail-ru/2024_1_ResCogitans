import Header from '../../components/Header/Header';
import MainSearch from '../../components/MainSearch/MainSearch';
import Placelist from '../../components/Placelist/Placelist';

import template from './Main.hbs';

class Main {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return template();
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    const content = document.getElementById('content');
    const search = document.getElementById('main-search');
    new Header(content).render();
    new MainSearch(search).render();
    new Placelist(search).render();
  }
}

export default Main;
