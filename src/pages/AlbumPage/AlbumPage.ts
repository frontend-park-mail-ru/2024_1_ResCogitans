import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import AlbumPhoto from './AlbumPhoto';

import { PhotoData, AlbumParams, AlbumInfo, AlbumData } from 'src/types/api';
import { createAlbum, deleteAlbum, deletePhoto, getAlbum, uploadAlbumPhotos } from '@api/album';

class AlbumPage extends Base {

  form: AuthorizationForm;

  params: AlbumParams;

  albumData: AlbumInfo;

  isOwn: boolean;

  imagesAmount = 0;

  constructor(parent: HTMLElement, params: AlbumParams) {
    super(parent, template);

    this.form = new AuthorizationForm(this.parent, '');
    this.params = {
      id: parseInt(params[1]), type: params[0],
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
    const title = infoContainer.querySelector('h1') as HTMLHeadingElement;
    const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
    const infoContainerDescription = infoContainer.querySelector('h2') as HTMLHeadingElement;
    let albumName: HTMLInputElement;
    let albumDescription: HTMLTextAreaElement;

    this.swipeHandler(imageDialog);

    let curImageIndex = 1;

    const IDsToDelete = new Set<number>;

    let formData = new FormData();

    let PHOTOS_STATE: AlbumPhoto[] = [];

    let REQUEST_PHOTOS;

    if (this.params.type !== 'new') {
      getAlbum(this.params.id).then((albumData) => {

        if (!albumData || albumData.status !== 200) {
          return;
        }

        this.isOwn = (this.userData !== null && this.userData.userID === albumData.data.albumInfo.userID);
        if (this.params.type !== 'view' && !this.isOwn) {
          this.params.type = 'view';
        }

        this.albumData = albumData.data;

        REQUEST_PHOTOS = this.albumData.albumPhotos;

        if (REQUEST_PHOTOS) {
          for (let img of REQUEST_PHOTOS) {
            const image = new AlbumPhoto(img, this.params.type);
            image.create(photoContainer);
            PHOTOS_STATE.push(image);
          }
          this.imagesAmount = REQUEST_PHOTOS.length;
        }


        title.textContent = this.albumData.albumInfo.name;
        infoContainerDescription.textContent = this.albumData.albumInfo.description;

      });
    }


    const renderAsView = () => {

      infoContainer.querySelector('div').remove();

      if (this.isOwn) {
        const editButton = this.createElement('button', {
          class: 'button-primary',
        }, 'Редактировать альбом', {
          parent: infoContainer,
        });
        editButton.setAttribute('href', `/albums/edit'/${this.albumData.albumInfo.albumID}`);
      }

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

         
          formData.append('id', this.userData.userID.toString());
          const mappedDescriptions = PHOTOS_STATE.map(img => ({
            [img.photo.photo.id]: img.photo.photo.description,
          }));
          const descriptions = JSON.stringify(mappedDescriptions.flat());
          formData.append('descriptions', descriptions);

          if (this.params.type === 'new') {

            const name = albumName.value;
            const description = albumDescription.value;
            const requestBody = {
              name: name, description: description,
            };
  
            createAlbum(this.userData.userID, requestBody).then((responseData) => {
              if (responseData.status !== 200) {
                this.form.renderError(lowestInput, responseData.data.error);
              } else {
                uploadAlbumPhotos(this.params.id, formData);
              }
            });

          } else if (this.params.type === 'edit') {
            IDsToDelete.forEach((idToDelete) => {
              deletePhoto(this.params.id, idToDelete);
            });
            uploadAlbumPhotos(this.params.id, formData).then((response) => {
              if (response.status === 200) {
                submitButton.setAttribute('href', `${this.params.id}`);
                submitButton.click();
              } else {
                this.form.renderError(lowestInput, response.data.error);
              }
            });
          } 

          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }

        });
      });

      if (this.params.type === 'edit') {
        console.log(this.params.type);
        title.textContent = 'Имя альбома';
        infoContainerDescription.textContent = 'Измените фото или загрузите новые';
        if (this.imagesAmount > 0) {
          const imageAdded = new Event('imageadded');
          document.dispatchEvent(imageAdded);
        }
        const deleteAlbumButton = this.createElement('button', {
          class: 'button-danger',
        }, 'Удалить альбом', {
          parent: infoContainer,
        }) as HTMLButtonElement;
        let clickCount = 0;

        deleteAlbumButton.addEventListener('click', () => {
          clickCount++;
          if (clickCount == 1) {
            deleteAlbumButton.textContent = 'Удалить альбом?';
          } else if (clickCount > 1) {
            deleteAlbum(this.userData.userID, this.params.id).then((response) => {
              if (response.status !== 200) {
                this.form.renderError(lowestInput, response.data.error);
              } else {
                deleteAlbumButton.setAttribute('href', '/');
                deleteAlbumButton.click();
              }
            });
          }
        });
      } else if (this.params.type === 'new') {
        albumName = this.createElement('input', {
          placeholder: 'Введите название',
          type: 'text',
        }, '', {
          parent: infoContainer,
        }) as HTMLInputElement;
        albumDescription = this.createElement('textarea', {
          placeholder: 'Введите описание',
        }, '', {
          parent: infoContainer,
        }) as HTMLTextAreaElement;
      }

      let changePhotoId = -1;

      imageUploadInput.addEventListener('changephoto', (e: Event) => {
        changePhotoId = e.detail.id;
      });

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


            if (files.length === 1 && changePhotoId > 0) {
              const newFile = files[0];
              const oldPhoto = PHOTOS_STATE[changePhotoId - 1];
              if (formData.get(`${changePhotoId}`)) {
                formData.delete(`${changePhotoId}`);
              }
              formData.append(`${changePhotoId}`, newFile, newFile.name);
              const imgURL = URL.createObjectURL(newFile);
              oldPhoto.setURL(imgURL);
              IDsToDelete.add(oldPhoto.oldID); // запрос на сервер с удалением
              changePhotoId = -1;
              console.log('here');
              return;
            }

            this.imagesAmount += 1;
            formData.append(`${this.imagesAmount}`, files[i], files[i].name);

            const imgURL = URL.createObjectURL(files[i]);

            const imageData = {
              id: this.imagesAmount, url: imgURL, description: '', type: 'edit', origin: 'upload', filename: files[i].name,
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

      document.addEventListener('photosdeleted', (e: Event) => {
        this.imagesAmount--;

        if (this.imagesAmount === 0) {
          submitButton.remove();
          imageUploadInput.value = '';
        }

        const photoID = e.detail.id;

        const photoToDelete = PHOTOS_STATE[photoID - 1];
        if (photoToDelete.photo.origin === 'response') {
          IDsToDelete.add(photoToDelete.oldID); // запрос на сервер с удалением
        } else {
          formData.delete(photoToDelete.photo.photo.id.toString());
        }

        PHOTOS_STATE[photoID - 1].photoDiv.remove();
        PHOTOS_STATE = PHOTOS_STATE.filter((item) =>
          item.photo.photo.id !== photoID,
        );

        PHOTOS_STATE.map((item, index) => {
          item.updateIndex(index);
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

      this.updateModal(PHOTOS_STATE[curImageIndex]);
    });

    const closeButton = this.createElement('button', {
      class: 'icon top-right delete-icon',
    }, '', {
      parent: imageDialog,
    });

    closeButton.addEventListener('click', () => {
      imageDialog.close();
    });

    document.addEventListener('modalopen', (e: Event) => {
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
