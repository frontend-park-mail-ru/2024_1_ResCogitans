import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';

class AlbumPage extends Base {

  authForm: AuthorizationForm;

  constructor(parent: HTMLElement) {
    super(parent, template);
    this.authForm = new AuthorizationForm(this.parent, '');
  }

  render() {

    this.preRender();
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    new Header(header).render();

    const imageUploadInput = document.getElementById('upload-photo') as HTMLInputElement;
    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    const imageDialog = document.querySelector('.image-dialog') as HTMLDialogElement;
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const setPhotoAsMainInput = imageDialog.querySelector('input') as HTMLInputElement;
    const photoTextArea = imageDialog.querySelector('textarea') as HTMLTextAreaElement;
    const saveButton = imageDialog.querySelector('button') as HTMLButtonElement;

    let currentImageID: number;

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
            class: 'button-primary', id: 'submit-button',
          }, 'Создать альбом', {
            parent: infoContainer,
          }) as HTMLButtonElement;


          submitButton.addEventListener('click', () => {
            // formData.forEach((imageFile, index) => {
            //   formData.append(`descriptions[${index}]`, imageDescriptions[index]);
            //   formData.append(`orders[${index}]`, orders[index]);
            // });

            console.log(imageDescriptions);
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
