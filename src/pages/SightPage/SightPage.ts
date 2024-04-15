import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Sight } from 'src/types/api';
import Stars from '@components/Stars/Stars';
import Review from '@components/Review/Review';
import { post, get } from '@api/base';
import { router } from '@router/router';
import Button from '@components/Button/Button';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { ROUTES } from '@router/ROUTES';

class SightPage extends Base {
  id : number;

  sight : Sight;
 
  constructor(parent : HTMLElement) {
    super(parent);
    this.id = parseInt(window.location.pathname.split('/')[2], 10);
  }
  
  async renderReviews(response : unknown) {
    const reviewsDiv = document.querySelector('.sight-reviews') as HTMLDivElement;
    const userReviewDiv = document.querySelector('#user-review') as HTMLDivElement;

    if (response.data.comments === null) {
      reviewsDiv.insertAdjacentHTML('beforeend', '<p>Оставьте отзыв первыми</p>');

      if (this.isAuth === false) {
        userReviewDiv.remove();
        new Button(reviewsDiv, { className : 'button-primary', id : 'button-login-redirect', label : 'Войти', url : '/login' }).render();
      }
    } else {
      response.data.comments.forEach((review) => {
        review.username = review.username;
        if (this.userData === null || review.userID === this.userData.userID) {
          userReviewDiv.remove();
        }
        new Review(reviewsDiv, this.id, review, (this.userData && review.userID === this.userData.userID)).render();
      });
    }  
  }


  async render() {
    const responseSight = await get(`sight/${this.id}`);
    this.sight = responseSight.data.sight;
    
    if (responseSight.status === 404) {
      router.go('404');
      return;
    }
 
    await this.preRender();
 
    const header = document.getElementById('header') as HTMLElement;
    document.body.classList.remove('auth-background');
    await new Header(header).render();
    
    const ratingDiv = document.querySelector('.rating') as HTMLDivElement;
    await new Stars(ratingDiv, this.sight.rating).render(); 
  
    const submitButton = document.getElementById('review-submit') as HTMLButtonElement;
    const reviewForm = document.querySelector('.review-textarea') as HTMLTextAreaElement;
    const rateForm = document.getElementById('rate') as HTMLInputElement;

    await this.renderReviews(responseSight);

    const reviewsLabel = document.querySelector('#reviews-label') as HTMLHeadingElement;
    if (responseSight.data.comments !== null) {
      reviewsLabel.innerHTML += ` (${responseSight.data.comments.length})`;
    }

    submitButton?.addEventListener('click', (e : Event) => {
      e.preventDefault();

      if (this.userData === null) {
        router.go('login');
      }

      const feedback = reviewForm.value;
      const userID = this.userData.userID;
      const rating = parseInt(rateForm.value);
      const requestBody = { userID, rating, feedback };
      post(ROUTES.sights.createComment(this.id), requestBody).then((responseCreateReview) => {
        if (responseCreateReview.status === 200) {
          router.go(ROUTES.sights.view(this.id));
        }
      });
    });

    const cancelButtons = document.querySelectorAll('.cancel') as NodeListOf<HTMLButtonElement>;

    const deleteDialog = document.querySelector('.delete-dialog') as HTMLDialogElement;
    const editDialog = document.querySelector('.edit-dialog') as HTMLDialogElement;

    const deleteModalButton = deleteDialog.querySelector('.button-danger') as HTMLButtonElement;
    const editModalButton = editDialog.querySelector('.button-danger') as HTMLButtonElement;
   
    cancelButtons.forEach((button : HTMLButtonElement) => button.addEventListener('click', function () {
      document.querySelector('.staged-delete')?.classList.remove('staged-delete');
      deleteDialog.close();
      editDialog.close();
    }));

    deleteModalButton?.addEventListener('click', (e : Event) => {
      e.preventDefault();
      const commentID = document.querySelector('.staged-delete')?.id.split('-')[1];
      post(ROUTES.sights.deleteComment(this.id, commentID), {}).then((responseDeleteReview) => {
        if (responseDeleteReview.status === 401) {
          router.go('login');
        } else {
          deleteDialog.close();
          router.go(ROUTES.sights.view(this.id));
        }
      });
    });

    editModalButton?.addEventListener('click', (e : Event) => {
      e.preventDefault();
      const commentID = document.querySelector('.staged-delete')?.id.split('-')[1];
      const feedbackField = editDialog.querySelector('#editTextArea') as HTMLTextAreaElement;
      const userID = this.userData.userID;
      const ratingField = editDialog.querySelector('#rate') as HTMLTextAreaElement;
      const feedback = feedbackField.value;
      const rating = parseInt(ratingField.value);
      const body = { rating : rating, feedback : feedback, userID : userID };

      post(ROUTES.sights.editComment(this.id, commentID), body).then((responseDeleteReview) => {
        if (feedbackField.value.length < 5) {
          new AuthorizationForm(this.parent).renderError(editDialog, 'Отзыв не может быть короче 5 символов');
          return;
        }
        if (responseDeleteReview.status === 401) {
          router.go('login');
        } else {
          deleteDialog.close();
          router.go(ROUTES.sights.view(this.id));
        }
      });
    });
  }   
}
 
export default SightPage;
