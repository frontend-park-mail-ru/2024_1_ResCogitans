import Base from '@components/Base/Base';


interface PhotoData {
  id: number,
  url: string,
  description: string,
  filename?: string,
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
    this.oldID = photo.id;
  }

  create(parent: HTMLDivElement) {
    const photoDiv = this.base.createElement('div', {
      id: `${this.photo.photo.id}`,
      class: 'scroll-image',
    }, '', {
      parent: parent,
    }) as HTMLDivElement;

    const photoImage = this.base.createElement('img', {
      src: this.photo.photo.url,
      id: this.photo.photo.id.toString(),
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


      const setMainInput = this.base.createElement('input', {
        type: 'checkbox',
        id: 'setmain-input',
      }, '', {
        parent: div,
      }) as HTMLInputElement;

      const setMainLabel = this.base.createElement('label', {
        for: 'setmain-input',
      }, 'Сделать главной', {
        parent: div,

      }) as HTMLLabelElement;

      const deleteButton = this.base.createElement('button', {
        id: 'delete-button',
        class: 'button',
      }, 'Удалить фото', {
        parent: div,
      }) as HTMLButtonElement;

      deleteButton.addEventListener('click', (deleteEvent: Event) => {
        deleteEvent.stopImmediatePropagation();
        document.dispatchEvent(new CustomEvent('photosdeleted', {
          detail: {
            id: this.photo.photo.id,
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
          id: this.photo.photo.id,
        },
      }));

    });

    this.photoDiv = photoDiv;
    return photoDiv;
  }

  setURL(newUrl: string) {
    this.photo.photo.url = newUrl;
    this.image.src = newUrl;
  }

  updateIndex(index: number) {
    this.photoDiv.id = `${index + 1}`;
    this.photo.photo.id = index + 1;
    this.image.id = `${index + 1}`;
  }
}


export default AlbumPhoto;
