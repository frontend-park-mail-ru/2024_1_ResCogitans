import Base from '@components/Base/Base';
import SurveyQuestionData from '@types';
import Button from '@components/Button/Button';


class SurveyForm extends Base {

  surverQuestionData : SurveyQuestionData;

  constructor(parent: HTMLElement) {
    super(parent, '');
  }

  render() {

    const surveyButtonDiv = document.querySelector('.survey-button-group');

    for (let i = 1; i < 11; i++) {
      new Button(surveyButtonDiv, { className : 'button-primary', id : `survey-button-${i}`, label : `${i}` }).render();
    }
  }
}

export default SurveyForm;
