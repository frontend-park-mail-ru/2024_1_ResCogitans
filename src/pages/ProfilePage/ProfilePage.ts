import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { UserProfile, WithResponse } from 'src/types/api';
import { getUserTrips } from '@api/journey';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { getUserProfile, editProfile, resetPassword } from '@api/user';
import JourneyPreview from './JourneyPreview';
import { imageUpload } from '@api/user';
import { signupErrors } from '../../types/errors';
import ProfileBlock from './ProfileBlock';

class ProfilePage extends Base {

  isOwn : boolean;

  userID : number;

  userData: UserProfile;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
 
    super(parent);
    this.form = new AuthorizationForm(parent);
    this.userData = {} as UserProfile;
    this.userID = parseInt(arguments[1][0]);

    this.isOwn = (this.userID === this.userData.id); 
  }

  async render() {
    const profileData = await getUserProfile(this.userID);
    
    const authForm = new AuthorizationForm(this.parent);
  

    this.userData = {
      id: profileData.data.id,
      username: profileData.data.username,
      bio: profileData.data.bio,
      avatar: profileData.data.avatar,
      error: '',
    };
    
    await this.preRender();
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();

    const profileBlock = document.querySelector('#profile-block') as HTMLDivElement; 

    await new ProfileBlock(profileBlock, this.userData).render();

  
    const profileEditForm = document.querySelector('dialog') as HTMLDialogElement;
    
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

    const usernameField = inputs[0] as HTMLInputElement;
    const passwordField = inputs[1] as HTMLInputElement;
    const repeatPasswordField = inputs[2] as HTMLInputElement;
    const statusField = document.querySelector('textarea') as HTMLTextAreaElement;

    usernameField.value = this.userData.username;
    statusField.value = this.userData.bio;

    const imageInput = document.querySelector('#profile-edit-avatar') as HTMLInputElement;
    let formData : FormData;

    let lowestInput = document.querySelectorAll('.input')[2] as HTMLInputElement;

    imageInput.addEventListener('change', () => {
      if (imageInput.files && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const fileType = file.type;
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
     
        if (!validImageTypes.includes(fileType)) {
          authForm.renderError(lowestInput, 'Выберите аватарку допустимых форматов: jpeg, png, webp, gif');
          return;
        } else {
          authForm.clearError(lowestInput);
        }
     
        formData = new FormData();
        formData.append('file', file);
      }
    });
     

    submitButton.addEventListener('click', async (e : Event) => {
      e.preventDefault();
        
      if (document.querySelectorAll('.has-error').length !== 0) {
        return;
      }
    
      const profileBioNickEditResponse = await editProfile(this.userID, usernameField.value, statusField.value);
      if (profileBioNickEditResponse.status !== 200) {
        authForm.renderError(lowestInput, signupErrors[profileBioNickEditResponse.data.error]);
      } else {
        profileBlock.innerHTML = '';
        new ProfileBlock(profileBlock, profileBioNickEditResponse.data).render(); // вынести в тип
      }

      if (passwordField.value.length > 0 && passwordField.value === repeatPasswordField.value) {
        const passwordResponse = await resetPassword(this.userID, passwordField.value);
        if (passwordResponse.status === 401 && passwordField.value.length > 0) {
          authForm.renderError(lowestInput, signupErrors[passwordResponse.data.error]);
        }
      }

      if (formData) {
        const imageUploadResponse = await imageUpload(`profile/${this.userID}/upload`, formData) as WithResponse<UserProfile>;
        if (imageUploadResponse.status !== 200) {
          authForm.renderError(lowestInput, signupErrors[imageUploadResponse.data.error]);
        }
      }
     
      if (document.querySelectorAll('.has-error').length === 0) {
        profileEditForm.close();
      }
    });

    const journeyList = await getUserTrips(this.userID);
    if (journeyList.status === 200 && journeyList.data.journeys !== null) {
      const journeyDiv = document.querySelector('.profile-journeys') as HTMLDivElement;
      journeyDiv.innerHTML = '';
      journeyList.data.journeys.forEach((journey) => new JourneyPreview(journeyDiv, journey).render());
    }
   
  }
}

export default ProfilePage;
