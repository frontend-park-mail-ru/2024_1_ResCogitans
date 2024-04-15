import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { UserProfile } from 'src/types/api';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { get, post } from '@api/base';
import { router } from '@router/router';
import JourneyPreview from './JourneyPreview';
import { imageUpload } from '@api/user';
import { signupErrors } from '@types/errors';

class ProfilePage extends Base {

  userdata : UserProfile;

  isOwn : boolean;

  userID : number;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
 
    super(parent);
    this.form = new AuthorizationForm(parent);
    this.userID = parseInt(arguments[1][0]);

    this.isOwn = (this.userID === this.userData.userID); // нужна отдельная глобальная сущность пользователя, которая не будет зависеть от localStorage!!!
  }

  async render() {
    const profileData = await get(`profile/${this.userID}`);

    const authForm = new AuthorizationForm(this.parent);
    const avatar = profileData.data.avatar.replace(/.*\/public\//, '/public/');
    this.userdata = { id : profileData.data.id, username : profileData.data.username, status : profileData.data.bio, avatar : avatar };
    
    await this.preRender();
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();

    const profileSettingsButton = document.querySelector('#profile-edit-button') as HTMLButtonElement;
    const profileEditForm = document.querySelector('dialog') as HTMLDialogElement;
    
    profileSettingsButton?.addEventListener('click', () => {
      profileEditForm.showModal();
    });
    const submitButton = document.getElementById('button-submit') as HTMLButtonElement;

    const cancelButton = document.querySelector('#button-cancel') as HTMLButtonElement;
    cancelButton.addEventListener('click', () => profileEditForm.close());
    const passwordInputs = document.querySelectorAll('.password') as NodeListOf<HTMLInputElement>;

    passwordInputs.forEach((input : HTMLInputElement) => input.addEventListener('input', () => {
      const parent = input.parentElement as HTMLElement;
      validate( input.value, input.type )
        .catch((error) => { this.form.renderError(parent, error.message); })
        .then(() => {
          this.form.enableSubmitButton();
        });
      this.form.clearError(parent);
    },
    ));
    const inputs = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    const usernameField = inputs[0];
    const passwordField = inputs[1];
    const statusField = document.querySelector('textarea') as HTMLTextAreaElement;

    const imageInput = document.querySelector('#profile-edit-avatar') as HTMLInputElement;
    let formData : FormData;

    imageInput.addEventListener('change', () => {
      if (imageInput.files) {
        formData = new FormData();
        formData.append('file', imageInput.files[0]);
      }
    });

    submitButton.addEventListener('click', (e : Event) => {
      e.preventDefault();
      const profileRequestBody = { userID: this.userdata.id, username : usernameField.value, bio : statusField.value };
      post(`profile/${this.userdata.id}/edit`, profileRequestBody).then(() => {
        post(`profile/${this.userdata.id}/reset_password`, { password : passwordField.value }).then((passwordResponse) => {
          if (passwordResponse.status === 401) {
            authForm.renderError(document.querySelectorAll('.input')[2], signupErrors[passwordResponse.data.error]);
          }
          imageUpload(`profile/${this.userdata.id}/upload`, formData).then((response) => {
            if (response.status === 200) {
              router.go(`profile/${this.userdata.id}`);
            }
          });
        });
      });
    });

    const journeyList = await get(`${this.userdata.id}/trips`);
    if (journeyList.status === 200 && journeyList.data.journeys !== null) {
      const journeyDiv = document.querySelector('.profile-journeys ol') as HTMLDivElement;
      journeyDiv.innerHTML = '';
      journeyList.data.journeys.forEach((journey) => new JourneyPreview(journeyDiv, journey).render());
    }
   
  }
}

export default ProfilePage;
