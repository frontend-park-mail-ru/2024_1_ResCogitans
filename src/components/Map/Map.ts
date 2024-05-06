import Base from '@components/Base/Base';
import template from '@templates/Map.hbs';
import { getAdressByCoords } from '@api/sight';

class Map extends Base {

  latitude = 0;

  longitude = 0;

  zoom = 18;

  tiles = 3;

  mapDialog: HTMLDialogElement;

  adress: string;

  constructor(parent: HTMLElement) {
    super(parent, template);

  }

  showMap(longitude: number, latitude: number) {

    this.latitude = latitude;
    this.longitude = longitude;

    const mapContainer = this.mapDialog.querySelector('#map-container') as HTMLDivElement;

    const tileGrid = this.tiles;

    const tileGridHalf = Math.floor(tileGrid / 2);
    const zoomLevel = this.zoom;
    const tileX = Math.floor((longitude + 180) / 360 * Math.pow(2, zoomLevel));
    const tileY = Math.floor((1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoomLevel));

    mapContainer.innerHTML = '';
    mapContainer.style.gridTemplateColumns = `repeat(${tileGrid}, 1fr)`;

    for (let i = -tileGridHalf; i <= tileGridHalf; i++) {
      for (let j = -tileGridHalf; j <= tileGridHalf; j++) {
        const tileUrl = `https://tile.openstreetmap.org/${zoomLevel}/${tileX + j}/${tileY + i}.png`;
        const img = this.createElement('img', {
          src: tileUrl,
        }, '', {
          parent: mapContainer,
        });
      }
    }
  }

  render() {
    this.preRender();
    this.mapDialog = document.getElementById('map-dialog') as HTMLDialogElement;

    const closeButton = this.createElement('button', {
      class: 'icon top-right delete-icon', id: 'close-map-modal',
    }, '', {
      parent: this.mapDialog,
    });
    closeButton.addEventListener('click', () => {
      this.mapDialog.close();
    });


    const zoomInButton = this.createElement('button', {
      class: 'button-primary icon plus-icon', id: 'zoom-in-button',
    }, '', {
      parent: this.mapDialog,
    });

    zoomInButton.addEventListener('click', () => {
      this.zoom++;
      if (this.zoom > 19) {
        this.zoom = 19;
        return;
      } else {
        this.showMap(this.longitude, this.latitude);
      }
    });

    const zoomOutButton = this.createElement('button', {
      class: 'button-primary icon minus-icon', id: 'zoom-out-button',
    }, '', {
      parent: this.mapDialog,
    });

    zoomOutButton.addEventListener('click', () => {
      this.zoom--;
      if (this.zoom < 6) {
        this.zoom = 6;
        return;
      } else {
        this.showMap(this.longitude, this.latitude);
      }
    });

    return this.mapDialog;
  }

  getAdress(longitude: number, latitude: number) {
    return getAdressByCoords(latitude, longitude).then((adressResponse) => {
      return adressResponse.json();
    }).then((response) => {
      this.adress = response.display_name;
      return this.adress;
    });
  }
}

export default Map;
