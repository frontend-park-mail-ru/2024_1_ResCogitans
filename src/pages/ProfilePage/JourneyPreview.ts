import Base from '@components/Base/Base';
import template from '@templates/JourneyPreview.hbs';
import { Journey } from '@types/api';

class JourneyPreview extends Base {

  data : Journey;

  constructor(parent : HTMLElement, data : Journey) {
    super(parent, template);
    this.data = data;
  }
}

export default JourneyPreview;
