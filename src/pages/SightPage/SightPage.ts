import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Sight, ReviewContent } from 'src/types/api';
import Stars from '@components/Stars/Stars';
import Review from '@components/Review/Review';
import { post } from '@api/base';
import { getSight } from '@api/sight';
import { router } from '@router/router';
import Button from '@components/Button/Button';
import AuthorizationForm from '@components/Form/AuthorizationForm';
import { ROUTES } from '@router/ROUTES';
import template from '@templates/SightPage.hbs';


class SightPage extends Base {
  id : number;

  sight : Sight;

  formErrorHandler : AuthorizationForm;

  formErrorHandler : AuthorizationForm;
 
  constructor(parent : HTMLElement) {
    super(parent, template);
    this.id = parseInt(window.location.pathname.split('/')[2], 10);
    this.formErrorHandler = new AuthorizationForm();
  }

  validateFeedback(field : HTMLTextAreaElement, parent : HTMLElement) : boolean {
    
    if (field.value.length < 5) {
      this.formErrorHandler.renderError(parent, 'Отзыв не может быть короче 5 символов');
      return false;
    }
    return true;
  }
  
  renderReviews(response : unknown) {
    const reviewsDiv = document.querySelector('.sight-reviews') as HTMLDivElement;
    const userReviewDiv = document.querySelector('#user-review') as HTMLDivElement;

    if (response === null) {
      reviewsDiv.insertAdjacentHTML('beforeend', '<p>Оставьте отзыв первыми</p>');

      if (this.isAuth === false) {
        userReviewDiv.remove();
        new Button(reviewsDiv, { className : 'button-primary', id : 'button-login-redirect', label : 'Войти', url : '/login' }).render();
      }
    } else {
      response.forEach((review) => {
        review.username = review.username;
        if (this.userData === null || review.userID === this.userData.userID) {
          userReviewDiv.remove();
        }
        new Review(reviewsDiv, this.id, review, (this.userData && review.userID === this.userData.userID)).render();
      });
    }  
  }

  render() {
    get(`sight/${this.id}`).then((responseSight) => {
      this.sight = responseSight.data.sight;

      if (responseSight.status === 404) {
        router.go('404');
        return;
      }

      this.preRender();

      const header = document.getElementById('header') as HTMLElement;
      new Header(header).render();

      document.body.classList.remove('auth-background');
   
      const ratingDiv = document.querySelector('.rating') as HTMLDivElement;
      new Stars(ratingDiv, this.sight.rating).render(); 

      const deleteDialog = document.querySelector('.delete-dialog') as HTMLDialogElement;
      const editDialog = document.querySelector('.edit-dialog') as HTMLDialogElement;

      const editStarsContainer = editDialog.querySelector('#edit-stars-container') as HTMLElement;
  
      const submitButton = document.getElementById('review-submit') as HTMLButtonElement;
      const reviewForm = document.querySelector('#review-form') as HTMLFormElement;
      const reviewFormTextArea = reviewForm.querySelector('.review-textarea') as HTMLTextAreaElement;
      const starsContainer = document.getElementById('stars-container') as HTMLElement;
      const stars = new Stars(starsContainer, 5, true);
      stars.render();
  
      this.renderReviews(responseSight);

      const reviewsLabel = document.querySelector('#reviews-label') as HTMLHeadingElement;
      if (responseSight.data.comments !== null) {
        reviewsLabel.innerHTML += ` (${responseSight.data.comments.length})`;
      }

      const cancelButtons = document.querySelectorAll('.cancel') as NodeListOf<HTMLButtonElement>;


      const deleteModalButton = deleteDialog.querySelector('.button-danger') as HTMLButtonElement;
      const editModalButton = editDialog.querySelector('.button-danger') as HTMLButtonElement;

      submitButton?.addEventListener('click', (e : Event) => {
        e.preventDefault();

        if (this.userData === null) {
          router.go('login');
        }

        const feedback = reviewFormTextArea;
        const userID = this.userData.userID;
        const rating = stars.rating;
        const requestBody = { userID, rating, feedback : feedback.value };

        if (!this.validateFeedback(feedback, reviewForm)) {
          return;
        } else {
          this.formErrorHandler.clearError(editDialog);
          post(ROUTES.sights.createComment(this.id), requestBody).then((responseCreateReview) => {
            if (responseCreateReview.status === 200) {
              router.go(ROUTES.sights.view(this.id));
            }
          });
        }
      });
   
      cancelButtons.forEach((button : HTMLButtonElement) => button.addEventListener('click', function () {
        document.querySelector('.staged-delete')?.classList.remove('staged-delete');
        deleteDialog.close();
        editStarsContainer.innerHTML = '';
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
        const feedback = feedbackField.value;

        const editStars = new Stars(editStarsContainer, 5, true);
     
        if (editStarsContainer.children.length === 0) {
          editStars.render();
        }

        const rating = editStars.rating;

        const body = { rating : rating, feedback : feedback, userID : userID };

        if (!this.validateFeedback(feedbackField, editDialog)) {
          return;
        } else {
          this.formErrorHandler.clearError(editDialog);
          post(ROUTES.sights.editComment(this.id, commentID), body).then((responseDeleteReview) => {
            if (responseDeleteReview.status === 401) {
              router.go('login');
            } else {
              editDialog.close();
              router.go(ROUTES.sights.view(this.id));
            }
          });
        }
      });
      return;
    });

  }   
}
 
export default SightPage;
