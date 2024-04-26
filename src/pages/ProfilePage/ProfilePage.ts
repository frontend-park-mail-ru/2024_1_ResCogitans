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
import { router } from '@router/router';
import template from '@templates/ProfilePage.hbs';


class ProfilePage extends Base {

  isOwn : boolean;

  userID : number;

  userData: UserProfile;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
    super(parent, template);
    this.form = new AuthorizationForm(parent);
    this.userData = {} as UserProfile;
    this.userID = parseInt(arguments[1][0]);

   
    this.isOwn = (this.userData === null) ? false : (this.userID === this.userData.userID); 
  }

  render() {
    this.preRender();

    if (!this.userID) {
      router.go('404');
      return;
    }

    get(`profile/${this.userID}`).then((profileData) => {
      if (profileData.data.id === 0) {
        router.go('404');
        return;
      }
  
      const authForm = new AuthorizationForm();
    
  
      const profileTemplateData = { userID : profileData.data.id, username : profileData.data.username, status : profileData.data.bio, avatar : profileData.data.avatar };
      
      
      const header = document.getElementById('header') as HTMLElement;
      document.body.classList.remove('auth-background');
      new Header(header).render();
  
      const profileBlock = document.querySelector('#profile-block') as HTMLDivElement; 
  
      new ProfileBlock(profileBlock, profileTemplateData).render();
  
    
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
       
  
      submitButton.addEventListener('click', (e : Event) => {
        e.preventDefault();
  
        if (document.querySelectorAll('.has-error').length !== 0) {
          return;
        }
  
        if (formData) {
          imageUpload(ROUTES.profile.upload(this.userID), formData).then((imageUploadResponse) => {
            if (imageUploadResponse.status !== 200) {
              authForm.renderError(lowestInput, signupErrors[imageUploadResponse.data.error]);
            }
          });
        }
       
        const profileRequestBody = { userID: this.userData.id, username : usernameField.value, bio : statusField.value };
  
        post(ROUTES.profile.edit(this.userID), profileRequestBody).then((profileBioNickEditResponse) => {
          if (profileBioNickEditResponse.status !== 200) {
            authForm.renderError(lowestInput, signupErrors[profileBioNickEditResponse.data.error]);
          } else {
            profileBlock.innerHTML = '';
            const templateData = { userID : profileBioNickEditResponse.data.id, 
              username : profileBioNickEditResponse.data.username, 
              status : profileBioNickEditResponse.data.bio, 
              avatar : profileBioNickEditResponse.data.avatar };
  
            new ProfileBlock(profileBlock, templateData).render(); // вынести в тип
          }
        });
  
        if (passwordField.value.length > 0 && passwordField.value === repeatPasswordField.value) {
          post(ROUTES.profile.reset_password(this.userID), { password : passwordField.value }).then((passwordResponse) => {
            if (passwordResponse.status === 401) {
              authForm.renderError(lowestInput, signupErrors[passwordResponse.data.error]);
            } 
          });
        }
       
        if (document.querySelectorAll('.has-error').length === 0) {
          profileEditForm.close();
        }
      },
  
      );
  
      const journeyList = get(`${this.userID}/trips`);
      const journeyDiv = document.querySelector('.profile-journeys') as HTMLDivElement;
  
      if (journeyList.status === 200 && journeyList.data.journeys !== null) {
        journeyDiv.innerHTML = '';
        journeyList.data.journeys.forEach((journey) => new JourneyPreview(journeyDiv, journey).render());
      }
    });
   
  }
}

export default ProfilePage;
