import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import AlbumPhoto from './AlbumPhoto';
import { post } from '@api/base';
import { imageUpload } from '@api/user';


interface PhotoData {
  id: number,
  url: string,
  description: string,
  filename? : string,
}

let REQUEST_PHOTOS: PhotoData[] = [
  {
    id: 1,
    url: '/public/1.jpg',
    description: 'sample1',
    filename : '',
  },
];


for (let i = 2; i < 5; i++) {
  REQUEST_PHOTOS.push({
    id: i,
    url: `/public/${i}.jpg`,
    description: `Фото${i}`,
  });
}


interface AlbumParams {
  id: number,
  type: string,
}

class AlbumPage extends Base {

  form: AuthorizationForm;

  params: AlbumParams;

  imagesAmount = 0;

  constructor(parent: HTMLElement, params: AlbumParams) {
    super(parent, template);

    this.form = new AuthorizationForm(this.parent, '');
    this.params = {
      id: params[1], type: params[0],
    };

  }

  swipeHandler(swipeArea: HTMLElement) {

    let startX = 0;
    let endX = 0;

    swipeArea.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    swipeArea.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    function handleSwipe() {
      const swipeThreshold = 100;

      if (endX - startX > swipeThreshold) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowLeft',
        }));
      } else if (startX - endX > swipeThreshold) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowRight',
        }));
      }
    }

    swipeArea.addEventListener('touchend', () => {
      handleSwipe();
    });
  }

  updateModal(img: AlbumPhoto): number {

    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;

    const modalDescription = imageDialog.querySelector('#mobile-description') as HTMLParagraphElement;

    modalDescription.textContent = `${img.photo.photo.description}`;

    const modalImage = imageDialog.querySelector('img') as HTMLImageElement;
    modalImage.src = img.photo.photo.url;

    const photoOutOf = imageDialog.querySelector('p') as HTMLParagraphElement;
    photoOutOf.textContent = `Фото ${img.photo.photo.id} из ${this.imagesAmount}`;
    return img.photo.photo.id;
  }

  render() {

    this.preRender();

    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    new Header(header).render();

    const imageUploadInput = document.querySelector('input') as HTMLInputElement;
    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const title = infoContainer.querySelector('h1') as HTMLHeadElement;
    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    const photoOutOf = imageDialog.querySelector('p') as HTMLParagraphElement;
    const infoContainerDescription = infoContainer.querySelector('h2') as HTMLHeadingElement;
    let albumName : HTMLInputElement;
    let albumDescription : HTMLTextAreaElement;
    
    this.swipeHandler(imageDialog);

    let deleteButton: HTMLButtonElement;
    let curImageIndex = 1;

    const IDsToDelete : number[] = [];

    let formData = new FormData();


    let PHOTOS_STATE : AlbumPhoto[] = [];

    /* get('/albums/${id}).then((albumData : Photo[]) => {
        albumData
         for (let img of albumData) {
            ...
         }
      }) */

    // origin = 'response' | 'upload'

    if (this.params.type !== 'new') {
      for (let img of REQUEST_PHOTOS) {
        const image = new AlbumPhoto(img, this.params.type);
        image.create(photoContainer);
        PHOTOS_STATE.push(image);
      }
      this.imagesAmount = REQUEST_PHOTOS.length;
    }


    const renderAsView = () => {

      title.textContent = 'Имя альбома';
      infoContainerDescription.textContent = 'Описание альбома';
      infoContainer.querySelector('div').remove();
    
      const editButton = this.createElement('button', {
        class : 'button-primary', 
      }, 'Редактировать альбом', {
        parent : infoContainer, 
      });

      editButton.setAttribute('href', '/albums/edit');
      return;
    };

    const renderAsEdit = () => {

      const lowestInput = document.querySelector('.input') as HTMLInputElement;
      let submitButton: HTMLButtonElement;

      document.addEventListener('imageadded', () => {
        submitButton = this.createElement('button', {
          class: 'button-primary',
          id: 'submit-button',
        }, 'Сохранить', {
          parent: infoContainer,
        }) as HTMLButtonElement;

        submitButton.addEventListener('click', (e: Event) => {

          const name = albumName.value;
          const description = albumDescription.value;
          const requestBody = {
            name : name, description : description,
          };
          console.log(requestBody);

          // post('albums/create', requestBody).then((responseData) => {
          //   const id = responseData.data.id;
          //   formData.append('id', id);
          //   imageUpload(`albums/${id}`, formData);
          //   submitButton.setAttribute('href', `/albums/${id}`);
          // });
         
          const mappedDescriptions = PHOTOS_STATE.map(img => ({
            [img.photo.photo.id] : img.photo.photo.description,
          }));
          const descriptions = JSON.stringify(mappedDescriptions.flat());

          formData.append('descriptions', descriptions);
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }

          console.log(IDsToDelete);

          
        });

      });

      let fileNameHelperArray : string[] = [];
      console.log(this.params.type, infoContainer);

      if (this.params.type === 'edit') {
        title.textContent = 'Имя альбома';
        infoContainerDescription.textContent = 'Измените фото или загрузите новые';
        if (this.imagesAmount > 0) {
          const imageAdded = new Event('imageadded');
          document.dispatchEvent(imageAdded);
        } 
      } else {
        albumName = this.createElement('input', {
          placeholder : 'Введите название', 
          type: 'text',
        }, '', {
          parent : infoContainer, 
        });
        albumDescription = this.createElement('textarea', {
          placeholder : 'Введите описание', 
        }, '', {
          parent : infoContainer, 
        });
      }

      imageUploadInput.addEventListener('change', (e: Event) => {
        if (imageUploadInput.files && imageUploadInput.files.length > 0) {
          const files = imageUploadInput.files;

          for (let i = 0; i < files.length; i++) {
            const fileType = files[i].type;
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

            if (!validImageTypes.includes(fileType)) {
              this.form.renderError(lowestInput, 'Выберите фото допустимых форматов: jpeg, png, webp, gif');
              return;
            } else if (files[i].size > 8388608) { // 8 Mb
              this.form.renderError(lowestInput, 'Выберите фото размером меньше 8 Мб');
              return;
            } else {
              this.form.clearError(lowestInput);
            }

            this.imagesAmount += 1;

            formData.append(`${this.imagesAmount}`, files[i], files[i].name);
          
            fileNameHelperArray.push(`file${this.imagesAmount}`);

            const imgURL = URL.createObjectURL(files[i]);
            
            const imageData = {
              id : this.imagesAmount, url : imgURL, description : '', type : 'edit', origin : 'upload', filename : files[i].name,
            };
            const image = new AlbumPhoto(imageData, 'edit');
            image.create(photoContainer);
            image.photo.origin = 'upload';

            PHOTOS_STATE.push(image);

            if (this.imagesAmount === 1) {
              const imageAdded = new Event('imageadded');
              document.dispatchEvent(imageAdded);
            }

          }

        }
      });

      document.addEventListener('photosdeleted', (e : Event) => {
        this.imagesAmount--;

        if (this.imagesAmount === 0) {
          submitButton.remove();
          imageUploadInput.value = '';
        }

        const photoID = e.detail.id;
        alert(photoID);

        const photoToDelete = PHOTOS_STATE[photoID - 1];
        if (photoToDelete.photo.origin === 'response') {
          IDsToDelete.push(photoToDelete.oldID); // запрос на сервер с удалением
          
          alert('photo from server');
        } else {
          formData.delete(photoToDelete.photo.photo.id.toString());
          alert('photo by user');
        }

        PHOTOS_STATE[photoID - 1].photoDiv.remove();
        PHOTOS_STATE = PHOTOS_STATE.filter((item) => 
          item.photo.photo.id !== photoID,
        );
        
        for (let item of PHOTOS_STATE) {
          console.log(item.photo.photo.id);
        }

        PHOTOS_STATE.map((item, index) => {
          item.updateIndex(index);
        });

        // photoContainer.innerHTML = '';

        // console.log(PHOTOS_STATE);
        // for (let item of PHOTOS_STATE) {
        //   new AlbumPhoto(item.photo.photo, item.photo.type).create(photoContainer);
        // }
       

      });

    };

    document.addEventListener('keydown', (key) => {
      if (this.imagesAmount === 0) return;
      const scrollWidth = photoContainer.scrollWidth;

      const avgScroll = Math.ceil(scrollWidth / this.imagesAmount);

      let newScrollPosition = photoContainer.scrollLeft;

      if (key.key === 'ArrowLeft') {
        newScrollPosition -= avgScroll;  // из за того что на мобилках эта херня иногда дает не 0, а -1 или -2, все ломается

        if (Math.abs(newScrollPosition) <= 3) { // хоть где то математика пригодилась
          newScrollPosition = 0; // костылительно но окей
        }
        newScrollPosition = (scrollWidth + newScrollPosition);
        curImageIndex--;

      } else if (key.key === 'ArrowRight') {
        newScrollPosition += avgScroll;
        curImageIndex = (curImageIndex + 1) % this.imagesAmount;
      } else {
        return;
      }

      newScrollPosition %= scrollWidth;
      photoContainer.scrollLeft = newScrollPosition;

      if (curImageIndex < 0) curImageIndex += this.imagesAmount;

      this.updateModal(PHOTOS_STATE[curImageIndex]);
    });

    const closeButton = this.createElement('button', {
      class: 'top-right',
    }, '⨉', {
      parent: imageDialog,
    });

    closeButton.addEventListener('click', () => {
      imageDialog.close();
    });

    document.addEventListener('modalopen', (e : Event) => {
      imageDialog.showModal();
      this.updateModal(PHOTOS_STATE[e.detail.id - 1]);
    });

    switch (this.params.type) {
      case 'new':
      case 'edit':
        renderAsEdit();
        break;
      case 'view':
        renderAsView();
        break;
    }

  }
}

export default AlbumPage;
