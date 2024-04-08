import Base from '@components/Base/Base';
import Header from '@components/Header/Header';
import { Sight } from 'src/types/api';
import Stars from '@components/Stars/Stars';
import Review from '@components/Review/Review';
import { post, get } from '@api/base';
import { router } from '@router/router';

class SightPage extends Base {
  id : number;

  sight : Sight;
 
  constructor(parent : HTMLElement) {
    super(parent);
    this.id = parseInt(window.location.pathname.split('/')[2], 10);
  }
  
  async renderReviews(response : unknown) {
    const username = localStorage.getItem('username');
    const reviewsDiv = document.querySelector('.sight-reviews') as HTMLDivElement;
    if (response.data.comments === null) {
      reviewsDiv.insertAdjacentHTML('beforeend', '<p>Оставьте отзыв первыми</p>');
    } else {
      response.data.comments.forEach((review) => {
        new Review(reviewsDiv, review, true, (review.username === username)).render();
      });
    }
  
  }

  async render() {
    const responseSight = await get(`sight/${this.id}`);
    this.sight = responseSight.data.sight;
    if (responseSight.status !== 200) {
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

    submitButton?.addEventListener('click', (e) => {
      e.preventDefault();
      const feedback = reviewForm.value;
      const sightID = this.id;
      //  const userID = parseInt(localStorage.getItem('userID'));
      const userID = 6;
      const rating = parseInt(rateForm.value);
      const requestBody = { userID, sightID, rating, feedback };
      post(`sight/${this.id}/create`, requestBody).then((responseCreateReview) => {
        if (responseCreateReview.status !== 200) {
          router.go('login');
        }
      });
    });
  }   
}
 
export default SightPage;
