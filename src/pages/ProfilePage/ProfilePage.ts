import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { validate } from '@utils/validation';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import JourneyPreview from './JourneyPreview';
import { editProfile, getUserProfile, imageUpload, resetPassword } from '@api/user';
import { profileErrors, signupErrors } from '../../types/errors';
import { ROUTES } from '@router/ROUTES';
import ProfileBlock from './ProfileBlock';
import { router } from '@router/router';
import template from '@templates/ProfilePage.hbs';
import { getUserTrips } from '@api/journey';
import { getUserAlbums } from '@api/album';

class ProfilePage extends Base {

  isOwn: boolean;

  userID: number;

  form: AuthorizationForm;

  constructor(parent: HTMLElement, params : unknown) {
    super(parent, template);
    this.userID = parseInt(params[0]);
  }

  render() {

    if (!this.userID) {
      router.go('404');
      return;
    }

    getUserProfile(this.userID).then((profileData) => {

      this.isOwn = (this.userData === null) ? false : (this.userID === profileData.data.id);
      this.preRender();

      if (profileData.data.id === 0) {
        router.go('404');
        return;
      }

      const authForm = new AuthorizationForm(this.parent, '');

      const profileTemplateData = {
        userID: profileData.data.id, username: profileData.data.username, status: profileData.data.bio, avatar: profileData.data.avatar,
      };


      const header = document.getElementById('header') as HTMLElement;
      document.body.classList.remove('auth-background');

      new Header(header).render();

      const profileBlock = document.querySelector('#profile-block') as HTMLDivElement;

      new ProfileBlock(profileBlock, profileTemplateData).render();

      const profileContent = document.querySelector('.profile-content') as HTMLDivElement;

      const profileEditForm = document.querySelector('dialog') as HTMLDialogElement;

      const submitButton = document.getElementById('button-submit') as HTMLButtonElement;

      const cancelButton = document.querySelector('#button-cancel') as HTMLButtonElement;
      cancelButton.addEventListener('click', () => profileEditForm.close());
      const passwordInputs = document.querySelectorAll('.password') as NodeListOf<HTMLInputElement>;


      const linkBlock = document.querySelector('#underlined-links') as HTMLDivElement;
      const journeyLink = this.createElement('label', {
        class: 'underlined-link',
      }, 'Поездки', {
        parent: linkBlock, position: 'into',
      });
      const albumsLink = this.createElement('label', {
        class: 'underlined-link',
      }, 'Альбомы', {
        parent: linkBlock, position: 'into',
      });

      let JOURNEY_DATA;
      let ALBUM_DATA;
      const contentBlock = document.getElementById('content-block') as HTMLDivElement;
      let createButton: HTMLButtonElement;

      if (this.isOwn) {
        createButton = this.createElement('button', {
          class: 'button-primary button-link', id: 'create-button', href: '/journey/new',
        }, 'Создать поездку', {
          parent: contentBlock, position: 'after',
        }) as HTMLButtonElement;
      }

      journeyLink.addEventListener('click', () => {
        profileContent.innerHTML = '';
        if (!JOURNEY_DATA) {
          this.createElement('h3', {}, this.isOwn ? 'Вы пока не создавали поездки' : 'Пользователь пока не создавал поездки', {
            parent: profileContent, position: 'into',
          });
        } else {
          JOURNEY_DATA.forEach((journey) => new JourneyPreview(profileContent, journey).render());
        }

        createButton.textContent = 'Создать новую поездку';
        albumsLink.classList.remove('active');
        journeyLink.classList.add('active');
        createButton.setAttribute('href', '/journey/new');
      });


      albumsLink.addEventListener('click', () => {
        profileContent.innerHTML = '';

        if (ALBUM_DATA && ALBUM_DATA.length > 0) {
          ALBUM_DATA.forEach((album) => {

            const albumLink = this.createElement('a', {
              href : `albums/${album.albumID}`, 
            }, '', {
              parent : profileContent,
            } );

            const AlbumDiv = this.createElement('div', {
              class: 'container',
            }, '', {
              parent: albumLink, position: 'into',
            });
  
            this.createElement('label', {
              class: 'h2',
            }, `${album.name}`, {
              parent: AlbumDiv, position: 'into',
            });

            this.createElement('label', {
              class: 'h2',
            }, `${album.description}`, {
              parent: AlbumDiv, position: 'into',
            });

          } );
        } else {
          this.createElement('h3', {}, this.isOwn ? 'Вы пока не создавали альбомы' : 'Пользователь пока не создавал альбомы', {
            parent: profileContent, position: 'into',
          });
        }
       
        createButton.textContent = 'Создать альбом';
        albumsLink.classList.add('active');
        journeyLink.classList.remove('active');
        createButton.setAttribute('href', '/albums/new');
      });

      // endblock

      passwordInputs.forEach((input: HTMLInputElement) => input.addEventListener('input', () => {
        const parent = input.parentElement as HTMLElement;
        validate(input.value, input.type)
          .catch((error) => { authForm.renderError(parent, error.message); });
        authForm.clearError(parent);
      },
      ));
      const inputs = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

      const usernameField = inputs[0] as HTMLInputElement;

      usernameField.addEventListener('change', () => {
        authForm.clearError(usernameField.parentElement as HTMLElement);
      });

      const passwordField = inputs[1] as HTMLInputElement;
      const newPasswordField = inputs[2] as HTMLInputElement;
      const statusField = document.querySelector('textarea') as HTMLTextAreaElement;

      usernameField.value = profileTemplateData.username;
      statusField.value = profileTemplateData.status;

      const imageInput = document.querySelector('#profile-edit-avatar') as HTMLInputElement;
      let formData: FormData;

      let lowestInput = document.querySelectorAll('.input')[4] as HTMLInputElement;

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


      submitButton.addEventListener('click', (e: Event) => {
        e.preventDefault();

        if (document.querySelectorAll('.has-error').length !== 0) {
          return;
        }

        if (formData) {
          imageUpload(ROUTES.profile.upload(this.userID), formData).then((imageUploadResponse) => {
            if (imageUploadResponse.status !== 200) {
              authForm.renderError(usernameField, signupErrors[imageUploadResponse.data.error]);
            }
          });
        }

        if (usernameField.value.length > 5 || usernameField.value.length === 0) {
          editProfile(this.userData.userID, usernameField.value, statusField.value)
            .then((profileBioNickEditResponse) => {
              if (profileBioNickEditResponse.status === 200) {
                profileBlock.innerHTML = '';
                const templateData = {
                  userID: profileBioNickEditResponse.data.id,
                  username: profileBioNickEditResponse.data.username,
                  status: profileBioNickEditResponse.data.bio,
                  avatar: !profileBioNickEditResponse.data.avatar ? '' : profileBioNickEditResponse.data.avatar,
                };

                new ProfileBlock(profileBlock, templateData).render();
              } else {
                authForm.renderError(usernameField.parentElement as HTMLElement, profileErrors[profileBioNickEditResponse.data.error]);
              }
            });
        } else {
          authForm.renderError(usernameField.parentElement as HTMLElement, profileErrors.short);
        }


        if (passwordField.value.length > 0 && passwordField.value !== newPasswordField.value) {
          resetPassword(this.userData.userID, newPasswordField.value).then((passwordResponse) => {
            if (passwordResponse.status !== 200) {
              authForm.renderError(newPasswordField.parentElement as HTMLElement, signupErrors[passwordResponse.data.error]);
            }
          });
        } else {
          authForm.renderError(newPasswordField.parentElement as HTMLElement, profileErrors.notnew);
        }
        // не давать запросам выполняться при наличии хоть одной ошибки!!!
      },

      );

      getUserTrips(this.userID).then((journeyList) => {
        if (journeyList.status === 200 && journeyList.data.journeys !== null) {
          JOURNEY_DATA = journeyList.data.journeys;
          profileContent.innerHTML = '';
          JOURNEY_DATA.forEach((journey) => new JourneyPreview(profileContent, journey).render());
          journeyLink.classList.add('active');
        } else {
          this.createElement('h3', {}, this.isOwn ? 'Вы пока не создавали поездки' : 'Пользователь пока не создавал поездки', {
            parent: profileContent, position: 'into',
          });
        }
      });

      getUserAlbums(this.userID).then((albumList) => {
        if (albumList.status === 200 && albumList.data.albums !== null) {
          ALBUM_DATA = albumList.data.albums;
          profileContent.innerHTML = '';
          ALBUM_DATA.forEach((album) => {

            const albumLink = this.createElement('a', {
              href : `albums/${album.albumID}`, 
            }, '', {
              parent : profileContent,
            } );

            const AlbumDiv = this.createElement('div', {
              class: 'container',
            }, '', {
              parent: albumLink, position: 'into',
            });
  
            this.createElement('label', {
              class: 'h2',
            }, `${album.name}`, {
              parent: AlbumDiv, position: 'into',
            });

            this.createElement('label', {
              class: 'h2',
            }, `${album.description}`, {
              parent: AlbumDiv, position: 'into',
            });

          } );
        } else {
          this.createElement('h3', {}, this.isOwn ? 'Вы пока не создавали альбомы' : 'Пользователь пока не создавал альбомы', {
            parent: profileContent, position: 'into',
          });
        }
      });

    });

  }
}

export default ProfilePage;
