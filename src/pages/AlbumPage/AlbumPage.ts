import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';


const PHOTOS = [
  {
    id: 1,
    url: '/public/1.jpg',
    description : 'sample1',
  },
  {
    id: 2,
    url: '/public/2.jpg',
    description : 'sample2',
  },
  {
    id: 3,
    url: '/public/3.jpg',
    description : 'текст',
  },
  {
    id: 4,
    url: '/public/4.jpg',
    description : 'sample4',
  },
  {
    id: 5,
    url: '/public/5.jpg',
    description : 'sample5',
  },
];

interface AlbumParams {
  id: number,
  type: string,
}

class AlbumPage extends Base {

  authForm: AuthorizationForm;

  params: AlbumParams;

  constructor(parent: HTMLElement, params: AlbumParams) {
    super(parent, template);

    this.authForm = new AuthorizationForm(this.parent, '');
    this.params = {
      id: params[1], type: params[0],
    };

  }

  renderAsView() {
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const title = infoContainer.querySelector('h1') as HTMLHeadElement;
    title.textContent = 'Альбом';

    infoContainer.querySelector('div').remove();

    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    imageDialog.classList.add('fullscreen');
    imageDialog.querySelector('#image-content').remove();

    const closeButton = this.createElement('button', {
      class : 'top-right', 
    }, 'X', {
      parent : imageDialog, 
    });
    closeButton.addEventListener('click', () => {
      imageDialog.close();
    });

   

    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    photoContainer.classList.add('scroll-container');
    photoContainer.removeAttribute('id');

    for (let img of PHOTOS) {
      const photoDiv = this.createElement('div', {
        id: `${img.id}`,
        class: 'scroll-image',
      }, '', {
        parent: photoContainer,
      });

      const image = this.createElement('img', {
        src: img.url,
      }, '', {
        parent: photoDiv,
      });

      const imageDescription = this.createElement('label', {
        class : 'no-margin', 
      }, img.description, {
        parent : photoDiv, position : 'into', 
      });

      photoContainer.appendChild(photoDiv);

      photoDiv.addEventListener('click', () => {
        imageDialog.showModal();

        const modalImage = imageDialog.querySelector('img') as HTMLImageElement;
        modalImage.src = img.url;
        modalImage.classList.remove('image-dialog-image');
        modalImage.classList.add('fullscreen');
      });

    }

    const imagesAmount = photoContainer.querySelectorAll('div').length;
    window.addEventListener('keydown', (key) => {
      const scrollWidth = photoContainer.scrollWidth;
      let avgScroll = scrollWidth / imagesAmount;
      console.log(avgScroll);
  
      let scr = photoContainer.scrollLeft;
      console.log(scr);
      if (key.key === 'ArrowLeft') {
        if (photoContainer.scrollLeft - avgScroll > 0) photoContainer.scrollLeft -= avgScroll;
      } else if (key.key === 'ArrowRight') {
        if (photoContainer.scrollLeft + avgScroll < scrollWidth) photoContainer.scrollLeft += avgScroll;
      }
      console.log(scr);
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

        if (!validImageTypes.includes(fileType)) {
          this.authForm.renderError(lowestInput, 'Выберите фото допустимых форматов: jpeg, png, webp, gif');
          return;
        } else {
          this.authForm.clearError(lowestInput);
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
        }, 'X', {
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
