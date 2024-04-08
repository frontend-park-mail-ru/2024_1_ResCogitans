import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import Review from '@components/Review/Review';
import { UserProfile } from 'src/types/api';

const userProfileExample : UserProfile = {
  id: 999,
  username: 'exg0rd',
  status: '23 года, дизайнер из Сан-Франциско',
};

class ProfilePage extends Base {

  userdata : UserProfile;

  constructor(parent : HTMLElement) {
    super(parent);
    this.userdata = userProfileExample;
  }

  async render() {
    await this.preRender();
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();

    const profileSettingsButton = document.querySelector('#profile-edit-button');
    profileSettingsButton?.addEventListener('click', () => {
      alert(this.userdata);
    });

    let response = get(`sight/${this.id}`);
    const reviewsDiv = document.querySelector('.profile-reviews') as HTMLDivElement;

    if (response.data.comments === null) {
      reviewsDiv.insertAdjacentHTML('beforeend', '<p>Оставьте отзыв первыми</p>');
    } else {
      response.data.comments.forEach((review) => new Review(reviewsDiv, review, true).render());
    }
  }
}

export default ProfilePage;
