import Base from '@components/Base/Base';


interface PhotoData {
  photoID: number,
  path: string,
  description: string,
  filename?: string,
  oldID : number,
}

interface Photo {
  photo: PhotoData;
  type: string,
  origin: string,
}


class AlbumPhoto {

  base: Base;

  photo: Photo;

  photoDiv: HTMLDivElement;

  image: HTMLImageElement;

  oldID: number;


  constructor(photo: PhotoData, type: string) {
    this.base = new Base(undefined, '');
    this.photo = {
      photo: photo,
      type: type,
      origin: 'response',
    };
    this.oldID = photo.oldID;
  }

  create(parent: HTMLDivElement) {
    const photoDiv = this.base.createElement('div', {
      id: `${this.photo.photo.photoID}`,
      class: 'scroll-image',
    }, '', {
      parent: parent,
    }) as HTMLDivElement;

    const photoImage = this.base.createElement('img', {
      src: this.photo.photo.path,
      id: this.photo.photo.photoID.toString(),
      class : 'scroll-img',
    }, '', {
      parent: photoDiv,
    }) as HTMLImageElement;

    this.image = photoImage;

    if (this.photo.type === 'edit') {

      const div = this.base.createElement('div', {
        class: 'container photo-data',
      }, '', {
        parent: photoDiv,
      });

      const imageDescription = this.base.createElement('input', {
        placeholder: 'Изменить описание',
        type: 'text',
        value: this.photo.photo.description,
      }, '', {
        parent: div,
      },
      ) as HTMLInputElement;

      const deleteButton = this.base.createElement('button', {
        id: 'delete-button',
        class: 'button icon delete-icon',
      }, '', {
        parent: div,
      }) as HTMLButtonElement;

      const changePhotoButton = this.base.createElement('button', {
        id: 'change-button',
        class: 'button button-primary icon edit-icon',
      }, '', {
        parent: div,
      }) as HTMLButtonElement;


      changePhotoButton.addEventListener('click', (e : Event) => {
        const imageUploadInput = document.querySelector('input[type="file"]') as HTMLInputElement; 
        imageUploadInput.click();
        imageUploadInput.dispatchEvent(new CustomEvent('changephoto', {
          detail : {
            id : this.photo.photo.photoID, 
          },
        }));
      });

      deleteButton.addEventListener('click', (deleteEvent: Event) => {
        document.dispatchEvent(new CustomEvent('photosdeleted', {
          detail: {
            id: this.photo.photo.photoID,
          },
        }));
      });

      imageDescription.addEventListener('blur', () => {
        this.photo.photo.description = imageDescription.value;

      });

    } else {
      const imageDescription = this.base.createElement('p', {
        class: 'no-margin',
      }, this.photo.photo.description, {
        parent: photoDiv, position: 'into',
      });
    }

    photoImage.addEventListener('click', (e: Event) => {
      document.dispatchEvent(new CustomEvent('modalopen', {
        detail: {
          id: this.photo.photo.photoID,
        },
      }));

    });

    this.photoDiv = photoDiv;
    return photoDiv;
  }

  setURL(newUrl: string) {
    this.photo.photo.path = newUrl;
    this.image.src = newUrl;
  }

  updateIndex(index: number) {
    this.photoDiv.id = `${index + 1}`;
    this.photo.photo.photoID = index + 1;
    this.image.id = `${index + 1}`;
  }
}


export default AlbumPhoto;
