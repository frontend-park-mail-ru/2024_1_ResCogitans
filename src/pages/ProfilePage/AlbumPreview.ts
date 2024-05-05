import Base from '@components/Base/Base';
import template from '@templates/AlbumPreview.hbs';
import { AlbumData } from '@types/api';

class AlbumPreview extends Base {

  data : AlbumData;

  constructor(parent : HTMLElement, data : AlbumData) {
    super(parent, template);
    this.data =  data;
  }
}

export default AlbumPreview;
