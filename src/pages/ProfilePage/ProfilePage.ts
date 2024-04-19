import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { get, post } from '@api/base';
import JourneyPreview from './JourneyPreview';
import { imageUpload } from '@api/user';
import { signupErrors } from '../../types/errors';
import { ROUTES } from '@router/ROUTES';
import ProfileBlock from './ProfileBlock';

class ProfilePage extends Base {

  isOwn : boolean;

  userID : number;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
 
    super(parent);
    this.form = new AuthorizationForm(parent);
    this.userID = parseInt(arguments[1][0]);

    this.isOwn = (this.userID === this.userData.userID); 
  }

  async render() {
    const profileData = await get(`profile/${this.userID}`);

    const authForm = new AuthorizationForm(this.parent);
  

    const profileTemplateData = { id : profileData.data.id, username : profileData.data.username, status : profileData.data.bio, avatar : profileData.data.avatar };
    
    await this.preRender();
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();

    const profileBlock = document.querySelector('#profile-block') as HTMLDivElement; 

    await new ProfileBlock(profileBlock, profileTemplateData).render();

  
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

    usernameField.value = profileTemplateData.username;
    statusField.value = profileTemplateData.status;

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
      const input = document.querySelectorAll('.input')[2] as HTMLInputElement;

      if (formData) {
        imageUpload(ROUTES.profile.upload(this.userID), formData).then((imageUploadResponse) => {
          if (imageUploadResponse.status !== 200) {
            authForm.renderError(input, signupErrors[imageUploadResponse.data.error]);
          }
        });
      }
     
      const profileRequestBody = { userID: this.userData.id, username : usernameField.value, bio : statusField.value };

      post(ROUTES.profile.edit(this.userID), profileRequestBody).then((profileBioNickEditResponse) => {
        if (profileBioNickEditResponse.status !== 200) {
          authForm.renderError(input, signupErrors[profileBioNickEditResponse.data.error]);
        } else {
          profileBlock.innerHTML = '';
          const templateData = { id : profileBioNickEditResponse.data.id, 
            username : profileBioNickEditResponse.data.username, 
            status : profileBioNickEditResponse.data.bio, 
            avatar : profileBioNickEditResponse.data.avatar };

          new ProfileBlock(profileBlock, templateData).render(); // вынести в тип
        }
      });

      if (passwordField.value.length > 0 && passwordField.value === repeatPasswordField.value) {
        post(ROUTES.profile.reset_password(this.userID), { password : passwordField.value }).then((passwordResponse) => {
          if (passwordResponse.status === 401) {
            authForm.renderError(input, signupErrors[passwordResponse.data.error]);
          } 
        });
      }
     
      if (document.querySelectorAll('.has-error').length === 0) {
        profileEditForm.close();
      }
    },

    );

    const journeyList = await get(`${this.userID}/trips`);
    if (journeyList.status === 200 && journeyList.data.journeys !== null) {
      const journeyDiv = document.querySelector('.profile-journeys ol') as HTMLDivElement;
      journeyDiv.innerHTML = '';
      journeyList.data.journeys.forEach((journey) => new JourneyPreview(journeyDiv, journey).render());
    }
   
  }
}

export default ProfilePage;
