import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';


interface Photo {
  id: number,
  url: string,
  description: string,
}

// const PHOTOS: Photo[] = [
//   {
//     id: 1,
//     url: '/public/1.jpg',
//     description: 'sample1',
//   },
// ];


// for (let i = 2; i < 20; i++) {
//   PHOTOS.push({
//     id: i,
//     url: `/public/${i}.jpg`,
//     description: `Фото${i}`,
//   });
// }


let PHOTOS: Photo[] = [];

interface AlbumParams {
  id: number,
  type: string,
}

class AlbumPage extends Base {

  authForm: AuthorizationForm;

  params: AlbumParams;

  imagesAmount = 0;

  width: number;

  constructor(parent: HTMLElement, params: AlbumParams) {
    super(parent, template);

    this.authForm = new AuthorizationForm(this.parent, '');
    this.params = {
      id: params[1], type: params[0],
    };
    this.width = window.innerWidth;

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

  updateModal(img: Photo, imageDialog: HTMLDialogElement): number {

    const modalDescription = imageDialog.querySelector('#mobile-description') as HTMLParagraphElement;

    modalDescription.textContent = `${img.description}`;

    const modalImage = imageDialog.querySelector('img') as HTMLImageElement;
    modalImage.src = img.url;
    
    const photoOutOf = imageDialog.querySelector('p') as HTMLParagraphElement;
    photoOutOf.textContent = `Фото ${img.id} из ${this.imagesAmount}`;
    return img.id;
  }


  render() {

    this.preRender();

    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    new Header(header).render();

    const imageUploadInput = document.getElementById('upload-photo') as HTMLInputElement;
    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const title = infoContainer.querySelector('h1') as HTMLHeadElement;
    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    const photoOutOf = imageDialog.querySelector('p') as HTMLParagraphElement;
    let deleteButton: HTMLButtonElement;
    let curImageIndex = 1;

    interface ImageDescriptions {
      [key: number]: string;
    }


    const renderAsView = () => {

      title.textContent = 'Альбом';

      infoContainer.querySelector('div').remove();

      imageDialog.classList.add('fullscreen');

      this.swipeHandler(imageDialog);

      const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
      photoContainer.classList.add('scroll-container');
      photoContainer.removeAttribute('id');

      this.imagesAmount = PHOTOS.length;

     
      const modalImage = imageDialog.querySelector('img') as HTMLImageElement;

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

      return;
    };

    const renderAsEdit = () => {
      const imageDescriptions: ImageDescriptions = {};

      let formData = new FormData();
      const lowestInput = document.querySelector('.input') as HTMLInputElement;
      let submitButton: HTMLButtonElement;

      imageUploadInput.addEventListener('change', (e: Event) => {
        if (imageUploadInput.files && imageUploadInput.files.length > 0) {
          const file = imageUploadInput.files[0];
          const fileType = file.type;
          const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

          if (!validImageTypes.includes(fileType)) {
            this.authForm.renderError(lowestInput, 'Выберите фото допустимых форматов: jpeg, png, webp, gif');
            return;
          } else if (file.size > 8388608) {
            this.authForm.renderError(lowestInput, 'Выберите фото размером меньше 8 Мб');
            return;
          } else {
            this.authForm.clearError(lowestInput);
          }


          formData.append('file', file);
          this.imagesAmount++;

          const imgURL = URL.createObjectURL(file);
          const photoDiv = this.createElement('div', {
            id: `${this.imagesAmount}`,
            class: 'scroll-image',
          }, '', {
            parent: photoContainer,
          });

          PHOTOS.push({
            id: this.imagesAmount, url: imgURL, description: '',
          });

          const img = this.createElement('img', {
            src: imgURL,
            id: this.imagesAmount.toString(),
          }, '', {
            parent: photoDiv,
          }) as HTMLImageElement;

          const div = this.createElement('div', {
            class : 'container photo-data', 
          }, '', {
            parent : photoDiv, 
          });

          const imageDescription = this.createElement('input', {
            placeholder: 'Изменить описание',
          }, '', {
            parent: div,
          },
          ) as HTMLInputElement;


          const setMainInput = this.createElement('input', {
            type: 'checkbox',
            id: 'setmain-input',
          }, '', {
            parent: div,
          });

          const setMainLabel = this.createElement('label', {
            for: 'setmain-input',
          }, 'Сделать главной', {
            parent: div,
            
          });

          if (this.imagesAmount === 1) {
            const imageAdded = new Event('imageadded');
            document.dispatchEvent(imageAdded);
          }
        

          deleteButton = this.createElement('button', {
            id: 'delete-button',
            class: 'button',
          }, 'Удалить фото', {
            parent: div,
          }) as HTMLButtonElement;
  
          deleteButton.addEventListener('click', (deleteEvent: Event) => {
            this.imagesAmount--;
            deleteEvent.stopPropagation();
  
            const photoId = parseInt(photoDiv.id);

            photoDiv.remove();
            PHOTOS = PHOTOS.filter((item) => item.id !== photoId);
            PHOTOS.forEach((item, index) => {
              item.id = index + 1;
              const div = photoContainer.children[index] as HTMLDivElement;
              div.id = `${index + 1}`;
              div.querySelector('img').id = `${index + 1}`;
            });

            formData.delete('file');
            if (this.imagesAmount === 0) {
              const noPhotos = new Event('photosdeleted');
              document.dispatchEvent(noPhotos);
            }

          });

          imageDescription.addEventListener('onfocusout', () => {
            const photoId = parseInt(photoDiv.id);
            PHOTOS[photoId].description = imageDescription.value;
          });

        }
      });


      document.addEventListener('photosdeleted', () => {
        submitButton.remove();
        imageUploadInput.value = '';
      });

      document.addEventListener('imageadded', () => {
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

      this.updateModal(PHOTOS[curImageIndex], imageDialog);
    });

    photoContainer.addEventListener('click', (e: Event) => {
      if (e.target.tagName === 'IMG') {
        imageDialog.showModal();
        curImageIndex = parseInt(e.target.id) - 1;
        this.updateModal(PHOTOS[curImageIndex], imageDialog);
      }
      return;
    });

    const closeButton = this.createElement('button', {
      class: 'top-right',
    }, '⨉', {
      parent: imageDialog,
    });

    closeButton.addEventListener('click', () => {
      imageDialog.close();
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
