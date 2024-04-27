import Base from '@components/Base/Base';
import template from '@templates/SurveyForm.hbs';
import SurveyQuestionData from '@types';


class SurveyForm extends Base {

  surverQuestionData : SurveyQuestionData;

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  render() {
    this.preRender();
  }
}

export default SurveyForm;
