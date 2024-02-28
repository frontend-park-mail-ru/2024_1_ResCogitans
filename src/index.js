import Header from './components/Header/Header'
import MainSearch from './components/MainSearch/MainSearch'
import Placelist from './components/Placelist/Placelist';

const content = document.getElementById('content');
const search = document.getElementById('main-search');
const places = document.getElementById('places-list');
new Header(content).render();
new MainSearch(search).render();
new Placelist(search).render();