import Base from '@components/Base/Base';

class JourneyPreview extends Base {

  data : JourneyPreviewData;

  constructor(parent : HTMLElement, data : JourneyPreviewData) {
    super(parent, template);
    this.data = data;
  }
}

export default JourneyPreview;
