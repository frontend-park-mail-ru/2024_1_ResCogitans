import Base from '@components/Base/Base';
import template from '@templates/ProfileBlock.hbs';


class ProfileBlock extends Base {

  profileData : unknown; 

  isOwn : boolean;

  constructor(parent : HTMLElement, profileData : unknown) {
    super(parent, template);

    this.profileData = profileData;
    this.isOwn = (!this.userData) ? false : (this.profileData.userID === this.userData.userID); 
    console.log(this.profileData.userID, this.userData.userID);
    console.log(this.isOwn);

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
  }

}

export default ProfileBlock;
