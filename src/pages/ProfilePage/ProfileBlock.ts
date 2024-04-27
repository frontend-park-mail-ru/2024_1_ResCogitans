import Base from '@components/Base/Base';
import template from '@templates/ProfileBlock.hbs';
import urls from '@router/urls';
import  { router } from '@router/router';

class ProfileBlock extends Base {

  profileData : unknown; 

  isOwn : boolean;

  constructor(parent : HTMLElement, profileData : unknown) {
    super(parent, template);

    this.profileData = profileData;
    
    this.isOwn = (this.userData === null) ? false : (this.profileData.userID === this.userData.userID); 
    
    if (profileData.avatar === '') {
      this.profileData.avatar = '/static/placeholder.jpg';
    } else {
      this.profileData.avatar = profileData.avatar.replace(/.*\/public\//, '/public/');
    }
  }

  render() {
    this.preRender();

    const profileEditForm = document.querySelector('dialog') as HTMLDialogElement;
    
    const profileSettingsButton = document.querySelector('#profile-edit-button') as HTMLButtonElement;
    profileSettingsButton?.addEventListener('click', () => {
      profileEditForm.showModal();
    });

    const SurveyStatisticsButton = document.querySelector('#survey-statistics-button') as HTMLButtonElement;
    SurveyStatisticsButton?.addEventListener('click', () => {
      router.go(urls.survey);
    });
  }
}

export default ProfileBlock;
