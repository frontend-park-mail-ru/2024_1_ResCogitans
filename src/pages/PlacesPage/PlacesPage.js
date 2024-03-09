import Header from '../../components/Header/Header';
import MainSearch from '../../components/MainSearch/MainSearch';
import Placelist from './Placelist/Placelist';

import template from './PlacesPage.hbs';

class PlacesPage {
  constructor(parent) {
    this.parent = parent;
  }

  asHTML() {
    return template();
  }

  render() {
    document.body.style.backgroundImage = "";
    this.parent.insertAdjacentHTML('beforeend', this.asHTML());

    const header = document.getElementById('header');
    const mainsearch = document.getElementById('main-search');

    new Header(header).render();
    new MainSearch(mainsearch).render();
    new Placelist(mainsearch).render();
  }
}

export default PlacesPage;
