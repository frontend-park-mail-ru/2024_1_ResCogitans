import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { UserProfile } from 'src/types/api';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { get, post } from '@api/base';
import { router } from '@router/router';
import previewJourney from './PreviewJourney';

class ProfilePage extends Base {

  userdata : UserProfile;

  isOwn : boolean;
  userID : string;
  usernameURL : string;

  form : AuthorizationForm;

  constructor(parent : HTMLElement) {
    super(parent);
    this.form = new AuthorizationForm(parent);
    this.userID = window.location.pathname.split('/')[2];
    this.isOwn = (this.userID === localStorage.getItem('userID')); // нужна отдельная глобальная сущность пользователя, которая не будет зависеть от localStorage!!!
  }

  async render() {
    const profileData = await get(`profile/${this.userID}`);
    this.userdata = {id : profileData.data.id, username : profileData.data.username.split('@')[0], status : profileData.data.bio, avatarURL : profileData.data.avatar};
    if (profileData.status !== 200) {
      router.go('404');
      return;
    }

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
    const repeatPasswordField = inputs[2];
    const statusField = document.querySelector('textarea') as HTMLTextAreaElement;

    const imageInput = document.querySelector('#profile-edit-avatar') as HTMLInputElement;
    let formData : FormData;

    imageInput.addEventListener('change', () => {
      if (imageInput.files) {
        formData = new FormData();
        formData.append('image', imageInput.files[0]);
      }
    });

    submitButton.addEventListener('click', (e : Event) => {
      e.preventDefault();
      const profileRequestBody = {userID: this.userdata.id, username : usernameField.value, bio : statusField.value};
      post(`profile/${this.userdata.id}/edit`, profileRequestBody);
        // post(`upload`, formData).then(() =>  window.location.reload())
  });

    const journeyList = await get(`${this.userdata.id}/trips`);
    console.log(journeyList);
    if (journeyList.status === 200 && journeyList.data.journeys.length > 0) {
      const journeyDiv = document.querySelector('.profile-journeys') as HTMLDivElement;
      journeyDiv.innerHTML = "";
      journeyList.data.journeys.forEach((journey) => journeyDiv.innerHTML = previewJourney(journey.name, journey.description, journey.id));
    }
   
      const newJourneyButton = document.querySelector('#create-journey') as HTMLButtonElement;
      console.log(newJourneyButton);
      if (newJourneyButton) {
        newJourneyButton.addEventListener('click', () => {
          console.log('clkcked');
          router.go('journey');
        });
      }
  }
}

export default ProfilePage;
