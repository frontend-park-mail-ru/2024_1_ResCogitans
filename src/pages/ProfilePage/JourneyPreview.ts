import Base from '@components/Base/Base';
import template from '@templates/JourneyPreview.hbs';

class JourneyPreview extends Base {

  data : JourneyPreviewData;

  constructor(parent : HTMLElement, data : JourneyPreviewData) {
    super(parent, template);
    this.data = data;
  }
}

export default JourneyPreview;
