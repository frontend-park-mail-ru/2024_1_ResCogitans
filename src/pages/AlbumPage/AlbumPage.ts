import Base from '@components/Base/Base';
import template from '@templates/AlbumPage.hbs';
import Header from '@components/Header/Header';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import AlbumPhoto from './AlbumPhoto';

import { AlbumParams, AlbumInfo } from 'src/types/api';
import { createAlbum, deleteAlbum, deletePhoto, getAlbumByID, uploadAlbumPhotos } from '@api/album';

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
    modalImage.src = img.photo.photo.path;

    const photoOutOf = imageDialog.querySelector('p') as HTMLParagraphElement;
    photoOutOf.textContent = `Фото ${img.photo.photo.photoID} из ${this.imagesAmount}`;
    return img.photo.photo.photoID;
  }

  render() {

    this.preRender();

    const header = document.getElementById('header') as HTMLElement;
   
    new Header(header).render();

    const mainContainer = document.querySelector('div .container') as HTMLDivElement;
    document.body.classList.add('loading');
    const imageUploadInput = document.querySelector('input') as HTMLInputElement;
    const inputDiv = document.querySelector('.input') as HTMLDivElement;
    const photoContainer = document.getElementById('photo-container') as HTMLDivElement;
    const infoContainer = document.querySelector('.container') as HTMLDivElement;
    const title = infoContainer.querySelector('h1') as HTMLHeadingElement;
  
    const infoContainerDescription = infoContainer.querySelector('h2') as HTMLHeadingElement;
    let albumName: HTMLInputElement;
    let albumDescription: HTMLTextAreaElement;


    let curImageIndex = 0;

    const IDsToDelete = new Set<number>;

    let formData = new FormData();

    let PHOTOS_STATE: AlbumPhoto[] = [];

    getAlbumByID(this.params.id).then((albumData) => {

      mainContainer.classList.remove('hidden');
      document.body.classList.remove('loading');

      if (!albumData || albumData.status !== 200 && this.params.type !== 'new') {
        return;
      }

      if (this.params.type !== 'new') {
        this.albumData = albumData.data;

        this.isOwn = (this.userData !== null && this.userData.userID === this.albumData.albumInfo.userID);
  
        if (!this.isOwn) this.params.type = 'view';
  
  
        let REQUEST_PHOTOS = this.albumData.albumPhotos;
        this.imagesAmount = 0;
  
        if (this.isOwn === false) {
          this.params.type = 'view';
        }
  
        if (REQUEST_PHOTOS) {
          for (let img of REQUEST_PHOTOS) {
            this.imagesAmount++;
            const imageData = {
              photoID: this.imagesAmount, oldID : img.photoID, path: img.path, description: img.description, origin: 'response',
            };
            const image = new AlbumPhoto(imageData, this.params.type);
            image.create(photoContainer);
            PHOTOS_STATE.push(image);
          }
        }

        title.textContent = this.albumData.albumInfo.name;
        infoContainerDescription.textContent = this.albumData.albumInfo.description;
      }

      const imageDialog = document.querySelector('dialog') as HTMLDialogElement;
      this.swipeHandler(imageDialog);
     
      const renderAsView = () => {
        infoContainer.querySelector('div').remove();
    
        if (this.isOwn === true) {
          const editButton = this.createElement('button', {
            class: 'button-primary',
          }, 'Редактировать альбом', {
            parent: infoContainer,
          });
          editButton.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('redirect', {
              detail : {
                path : `/albums/edit/${this.albumData.albumInfo.albumID}`,
              },
            }));
          });
        }
    
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

            formData.append('id', this.userData.userID.toString());
            const mappedDescriptions = PHOTOS_STATE.map(img => ({
              [img.photo.photo.photoID]: img.photo.photo.description,
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
                  this.form.renderError(lowestInput, 'Что-то пошло не так');
                } else {
                  uploadAlbumPhotos(responseData.data.albumID, formData).then((response) => {
                    document.dispatchEvent(new CustomEvent('redirect',  {
                      detail : {
                        path : `/albums/view/${responseData.data.albumID}`, 
                      },
                    }),
                    );  
                  });
                }
              });
            } else if (this.params.type === 'edit') {
              console.log(IDsToDelete);
              IDsToDelete.forEach((idToDelete) => {
                deletePhoto(this.params.id, idToDelete);
              });
              uploadAlbumPhotos(this.params.id, formData).then((response) => {
                if (response.status === 200) {
                  document.dispatchEvent(new CustomEvent('redirect', {
                    detail : {
                      path : `albums/view/${this.params.id}`,
                    },
                  }));
                } else {
                  this.form.renderError(lowestInput, 'Что-то пошло не так');
                }
              });
            }

          });
        });

        inputDiv.classList.remove('hidden');
        if (this.params.type === 'edit') {
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
              deleteAlbumButton.textContent = 'Точно удалить альбом?';
            } else if (clickCount == 2) {
              deleteAlbum(this.userData.userID, this.params.id).then((response) => {
                if (response.status !== 200) {
                  this.form.renderError(lowestInput, 'Что-то пошло не так');
                } else {
                  deleteAlbumButton.setAttribute('href', '/');
                  deleteAlbumButton.click();
                }
              });
            } else {
              return;
            }
          });

        } else if (this.params.type === 'new') {
          title.textContent = 'Новый альбом';
          infoContainerDescription.textContent = 'Загрузите фотографии в альбом';
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
              const MEGABYTE_IN_BYTES = 1048576;

              if (!validImageTypes.includes(fileType)) {
                this.form.renderError(lowestInput, 'Выберите фото допустимых форматов: jpeg, png, webp, gif');
                return;
              } else if (files[i].size > 8 * MEGABYTE_IN_BYTES) {
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
                IDsToDelete.add(oldPhoto.oldID);
                console.log(oldPhoto.oldID);
                changePhotoId = -1;
                return;
              }

              this.imagesAmount += 1;
              formData.append(`${this.imagesAmount}`, files[i], files[i].name);

              const imgURL = URL.createObjectURL(files[i]);

              const imageData = {
                photoID: this.imagesAmount, path: imgURL, description: '', type: 'edit', origin: 'upload', filename: files[i].name,
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
          console.log(photoToDelete);
          if (photoToDelete.photo.origin === 'response') {
            IDsToDelete.add(photoToDelete.oldID);
            IDsToDelete.add(photoToDelete.oldID); // запрос на сервер с удалением
          } else {
            formData.delete(photoToDelete.photo.photo.photoID.toString());
          }

          PHOTOS_STATE[photoID - 1].photoDiv.remove();
          PHOTOS_STATE = PHOTOS_STATE.filter((item) =>
            item.photo.photo.photoID !== photoID,
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
          newScrollPosition -= avgScroll;

          if (Math.abs(newScrollPosition) <= 3) {
            newScrollPosition = 0;
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
        class: 'icon top-right close-icon',
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

    },
    );
  }
}


export default AlbumPage;
