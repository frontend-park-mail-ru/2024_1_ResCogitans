import Base from '@components/Base/Base';
import SurveyAnswerPreview from './SurveyAnswerPreview';
import template from '@templates/SurveyPage.hbs';
import Header from '@components/Header/Header';
import { getAverageSurvey } from '@api/survey'; 
import urls from '@router/urls';
import  { router } from '@router/router';

class SurveyPage extends Base {

  constructor(parent: HTMLElement) {
    super(parent, template);
  }

  render() {
    if (!this.userData) {
      router.go(urls.login);
      return;
    }
    
    this.preRender();

    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    new Header(header).render();

    getAverageSurvey().then((surveyList) => {        
    const surveyDiv = document.querySelector('.survey-statistics') as HTMLDivElement;

    if (surveyList.status === 200 && surveyList.data.surveys !== null) {
      surveyList.data.surveys.forEach((survey) => new SurveyAnswerPreview(surveyDiv, survey).render());
    }
    });
  }
}

export default SurveyPage;
