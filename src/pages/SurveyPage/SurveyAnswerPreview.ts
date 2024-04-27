import Base from '@components/Base/Base';
import template from '@templates/SurveyAnswerPreview.hbs';
import { SurveyStatisticQuestion } from 'src/types/api';

class SurveyAnswerPreview extends Base {

  data : SurveyStatisticQuestion;

  constructor(parent : HTMLElement, data : SurveyStatisticQuestion) {
    super(parent, template);
    this.data = data;
  }
}

export default SurveyAnswerPreview;
