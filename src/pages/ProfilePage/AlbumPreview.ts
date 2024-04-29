import Component from '@components/Base/Component';

interface AlbumPreviewParameters {
  href : string;
  name: string;
  albumID: number;
  imgPreviewUrl: string;
  type: string;
}

class AlbumPreview extends Component<AlbumPreviewParameters> {
  name: string;

  albumID: number;

  href : string;

  imgPreviewUrl: string;

  type: string;

  constructor(tagName: string, parameters: AlbumPreviewParameters) {
    super(tagName, parameters);
    this.name = parameters.name;
    this.href = parameters.href;
    this.albumID = parameters.albumID;
    this.imgPreviewUrl = parameters.imgPreviewUrl;
    this.type = parameters.type;

    this.setType();
  }

  setType(): void {
    if (this.type === 'preview') {
      this.asPreview();
    }
    this.stringToHTML();
  }

  asPreview() {
    this.stringForm =
            `<a class="link-no-decoration">
             <div class="container journey-preview">
                 <h2>${this.name}</h2>
                 <img src="${this.imgPreviewUrl}">
             </div>
         </a>`;
  }
}

export default AlbumPreview;
