import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';


interface Photo {
  id: number,
  url: string,
  description: string,
}

const PHOTOS: Photo[] = [
  {
    id: 1,
    url: '/public/1.jpg',
    description: 'sample1',
  },
];


for (let i = 2; i < 20; i++) {
  PHOTOS.push({
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

  authForm: AuthorizationForm;

  params: AlbumParams;

  imagesAmount: number;

  width : number;

  constructor(parent: HTMLElement, params: AlbumParams) {
    super(parent, template);

    this.authForm = new AuthorizationForm(this.parent, '');
    this.params = {
      id: params[1], type: params[0],
    };
    this.width = window.innerWidth;

  }

  swipeHandler(swipeArea : HTMLElement) {

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
        } )); 
      } else if (startX - endX > swipeThreshold) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowRight', 
        } )); 
      }
    }
    
    swipeArea.addEventListener('touchend', () => {
      handleSwipe();
    });
  }

  updateModal(img: Photo, imageDialog: HTMLDialogElement): number {
    const descriptionForPhones = imageDialog.querySelector('#mobile-description') as HTMLParagraphElement;
    if (this.width <= 480) {
      if (descriptionForPhones) {
        descriptionForPhones.textContent = `${img.description}`;
      } else {
        this.createElement('p', {
          id : 'mobile-description', 
        }, `${img.description}`, {
          parent: imageDialog,
        }) as HTMLParagraphElement;
      }
    }
    const modalImage = imageDialog.querySelector('img') as HTMLImageElement;
    modalImage.src = img.url;

    const photoOutOf = imageDialog.querySelector('label') as HTMLLabelElement;
    photoOutOf.textContent = `Фото ${img.id} из ${this.imagesAmount}`;
    return img.id;
  }

  renderAsView() {
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const title = infoContainer.querySelector('h1') as HTMLHeadElement;
    title.textContent = 'Альбом';

    infoContainer.querySelector('div').remove();

    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    imageDialog.classList.add('fullscreen');
    imageDialog.querySelector('#image-content').remove();

    this.swipeHandler(imageDialog);


    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    photoContainer.classList.add('scroll-container');
    photoContainer.removeAttribute('id');

    this.imagesAmount = PHOTOS.length;

    const closeButton = this.createElement('button', {
      class: 'top-right',
    }, '❌', {
      parent: imageDialog,
    });
    const photoOutOf = this.createElement('label', {
      class: 'top-left',
    }, `Фото из ${this.imagesAmount}`, {
      parent: imageDialog,
    });

    closeButton.addEventListener('click', () => {
      document.body.classList.remove('scroll-disabled');
      imageDialog.close();
    });


    const modalImage = imageDialog.querySelector('img') as HTMLImageElement;
    modalImage.classList.remove('image-dialog-image');
    modalImage.classList.add('fullscreen');

    for (let img of PHOTOS) {
      const photoDiv = this.createElement('div', {
        class: 'scroll-image',
      }, '', {
        parent: photoContainer,
      });

      const image = this.createElement('img', {
        src: img.url,
        id: `${img.id}`,
      }, '', {
        parent: photoDiv,
      });

      const imageDescription = this.createElement('p', {
        class: 'no-margin',
      }, img.description, {
        parent: photoDiv, position: 'into',
      });

      photoContainer.appendChild(photoDiv);

    }

    let curImageIndex = 1;

    photoContainer.addEventListener('click', (e: Event) => {
      if (e.target.tagName === 'IMG') {
        imageDialog.showModal();
        curImageIndex = parseInt(e.target.id) - 1;
        this.updateModal(PHOTOS[curImageIndex], imageDialog);
      }
      return;
    });

    document.addEventListener('keydown', (key) => {
      const scrollWidth = photoContainer.scrollWidth;
      const avgScroll = (scrollWidth / this.imagesAmount);

     
      let newScrollPosition = photoContainer.scrollLeft;
      if (key.key === 'ArrowLeft') {
        newScrollPosition -= avgScroll;
        if (newScrollPosition < 0) {
          newScrollPosition = (scrollWidth + newScrollPosition);
        }
      } else if (key.key === 'ArrowRight') {
        newScrollPosition += avgScroll;
      }

      newScrollPosition %= scrollWidth;
      photoContainer.scrollLeft = newScrollPosition;
     
      curImageIndex = Math.floor(photoContainer.scrollLeft / avgScroll);
     
      this.updateModal(PHOTOS[curImageIndex], imageDialog);
    });
     
     
     
    return;
  }


  render() {

    this.preRender();

    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    new Header(header).render();

    if (this.params.type === 'view') {
      this.renderAsView();
      return;
    }

    const imageUploadInput = document.getElementById('upload-photo') as HTMLInputElement;
    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const setPhotoAsMainInput = imageDialog.querySelector('input') as HTMLInputElement;
    const photoTextArea = imageDialog.querySelector('textarea') as HTMLTextAreaElement;
    const saveButton = this.createElement('button', {
      class: 'button-primary', id: 'save',
    }, 'Сохранить', {
      parent: imageDialog,
    });

    interface ImageDescriptions {
      [key: number]: string;
    }
    const imageDescriptions: ImageDescriptions = {};

    let fileCount = 0;

    let formData = new FormData();
    const lowestInput = document.querySelector('.input') as HTMLInputElement;
    let submitButton: HTMLButtonElement;

    let activeDiv: HTMLDivElement;

    imageUploadInput.addEventListener('change', (e: Event) => {
      if (imageUploadInput.files && imageUploadInput.files.length > 0) {
        fileCount++;
        const file = imageUploadInput.files[0];
        const fileType = file.type;
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

        if (!validImageTypes.includes(fileType)) {
          this.authForm.renderError(lowestInput, 'Выберите фото допустимых форматов: jpeg, png, webp, gif');
          return;
        } else {
          this.authForm.clearError(lowestInput);
        }

        if (fileCount === 1) {
          submitButton = this.createElement('button', {
            class: 'button-primary',
            id: 'submit-button',
          }, 'Создать альбом', {
            parent: infoContainer,
          }) as HTMLButtonElement;

          submitButton.addEventListener('click', (e: Event) => {

            // formData.forEach((imageFile, index) => {
            //   formData.append(`descriptions[${index}]`, imageDescriptions[index]);
            //   formData.append(`orders[${index}]`, orders[index]);
            // });
            const responseId = 1;
            submitButton.setAttribute('href', `/albums/${responseId}`);
            window.dispatchEvent(e);
          });

        }

        formData.append('file', file);

        const imgURL = URL.createObjectURL(file);
        const photoDiv = this.createElement('div', {
          id: `${fileCount}`,
          class: 'img-preview card',
        }, '', {
          parent: photoContainer,
        });
        const img = this.createElement('img', {
          src: imgURL,
        }, '', {
          parent: photoDiv,
        });

        const deleteButton = this.createElement('button', {
          class: 'button button-primary top-right',
        }, '❌', {
          parent: photoDiv,
        });

        deleteButton.addEventListener('click', (deleteEvent: Event) => {
          fileCount--;
          deleteEvent.stopPropagation();
          const photoId = parseInt(photoDiv.id);
          if (photoId in imageDescriptions) {
            delete imageDescriptions[photoId];
          }
          photoDiv.remove();
          formData.delete('file');
          if (fileCount === 0) {
            submitButton.remove();
          }
        });

        photoDiv.addEventListener('setmain', () => {
          if (photoDiv.classList.contains('photo-main')) {
            photoDiv.classList.remove('photo-main');
            return;
          } photoDiv.classList.add('photo-main');
        });

        photoDiv.addEventListener('click', (event: Event) => {
          if (activeDiv && photoDiv !== activeDiv) {
            photoTextArea.value = '';
            setPhotoAsMainInput.checked = false;
            activeDiv.classList.remove('photo-main');
          }
          const img = imageDialog.querySelector('img') as HTMLImageElement;
          img.src = imgURL;
          img.id = photoDiv.id;
          photoTextArea.value = !imageDescriptions[photoDiv.id] ? '' : imageDescriptions[photoDiv.id];
          imageDialog.showModal();
          activeDiv = photoDiv;
        });
      }
    });


    saveButton.addEventListener('click', () => {
      imageDialog.close();
      if (setPhotoAsMainInput.checked === true) {
        const setMainEvent = new Event('setmain');
        activeDiv.dispatchEvent(setMainEvent);
      }
      const imageId = parseInt(activeDiv.id);
      imageDescriptions[imageId] = photoTextArea.value;
    });
  }
}

export default AlbumPage;
