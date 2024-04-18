import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { UserProfile, WithResponse } from 'src/types/api';
import { getUserTrips } from '@api/journey';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { getUserProfile, editProfile, resetPassword } from '@api/user';
import { router } from '@router/router';
import JourneyPreview from './JourneyPreview';
import { imageUpload } from '@api/user';
import { signupErrors } from '../../types/errors';
import { ROUTES } from '@router/ROUTES';

class ProfilePage extends Base {

  userdata : UserProfile;

  isOwn : boolean;

  userID : number;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
 
    super(parent);
    this.form = new AuthorizationForm(parent);
    this.userdata = {} as UserProfile;
    this.userID = parseInt(arguments[1][0]);

    this.isOwn = (this.userID === this.userData.userID); 
  }

  async render() {
    const profileData = await getUserProfile(this.userID);
    
    const authForm = new AuthorizationForm(this.parent);
    let avatar;
    if (profileData.data.avatar === '') {
      avatar = '/static/placeholder.jpg';
    } else {
      avatar = profileData.data.avatar.replace(/.*\/public\//, '/public/');
    }

    this.userdata = {
      id: profileData.data.id,
      username: profileData.data.username,
      bio: profileData.data.bio,
      avatar: avatar,
      error: '',
    };
    
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
        .catch((error) => { this.form.renderError(parent, error.message); });
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

    submitButton.addEventListener('click', async (e : Event) => {
      e.preventDefault();
      const input = document.querySelectorAll('.input')[2] as HTMLInputElement;

      const profileBioNickEditResponse = await editProfile(this.userID, usernameField.value, statusField.value);
      if (profileBioNickEditResponse.status !== 200) {
        authForm.renderError(input, signupErrors[profileBioNickEditResponse.data.error]);
      }

      const passwordResponse = await resetPassword(this.userID, passwordField.value);
      if (passwordResponse.status === 401 && passwordField.value.length > 0) {
        authForm.renderError(input, signupErrors[passwordResponse.data.error]);
      }
      
      const imageUploadResponse = await imageUpload(ROUTES.profile.upload(this.userID), formData) as WithResponse<UserProfile>;
      if (imageUploadResponse.status !== 200) {
        authForm.renderError(input, signupErrors[imageUploadResponse.data.error]);
      }
    
      if (document.querySelectorAll('.has-error').length === 0) {
        router.go(ROUTES.profile.view(this.userID));
      }
    },

    );

    const journeyList = await getUserTrips(this.userdata.id);
    if (journeyList.status === 200 && journeyList.data.journeys !== null) {
      const journeyDiv = document.querySelector('.profile-journeys ol') as HTMLDivElement;
      journeyDiv.innerHTML = '';
      journeyList.data.journeys.forEach((journey) => new JourneyPreview(journeyDiv, journey).render());
    }
   
  }
}

export default ProfilePage;
