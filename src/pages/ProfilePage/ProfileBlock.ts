import Base from '@components/Base/Base';

class ProfileBlock extends Base {

  profileData : unknown; 

  isOwn : boolean;

  constructor(parent : HTMLElement, profileData : unknown) {
    super(parent);
    this.profileData = profileData;
    this.isOwn = (this.userData.userID === profileData.id);

    if (profileData.avatar === '') {
      this.profileData.avatar = '/static/placeholder.jpg';
    } else {
      this.profileData.avatar = profileData.avatar.replace(/.*\/public\//, '/public/');
    }
  }

  async render() {
    await this.preRender();

    const profileEditForm = document.querySelector('dialog') as HTMLDialogElement;
    
    const profileSettingsButton = document.querySelector('#profile-edit-button') as HTMLButtonElement;
    profileSettingsButton?.addEventListener('click', () => {
      profileEditForm.showModal();
    });
  }

}

export default ProfileBlock;
