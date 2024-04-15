import Base from '@components/Base/Base';
import Stars from '@components/Stars/Stars';
import { ReviewContent } from 'src/types/api';

class Review extends Base {

  reviewContent : ReviewContent;

  placeID : number;

  isOwn : boolean;
    
  constructor(parent : HTMLElement, placeID : number, reviewContent : ReviewContent, isOwn : boolean) {
    super(parent);
    this.placeID = placeID;
    this.reviewContent = reviewContent;
    this.isOwn = isOwn;
    
    if (!this.reviewContent.avatar) {
      this.reviewContent.avatar = '/static/placeholder.jpg';
    } else {
      this.reviewContent.avatar = this.reviewContent.avatar.replace(/.*\/public\//, '/public/');
    }
  

  async render() {
    await this.preRender();
    const ratingDiv = document.querySelector(`#review-${this.reviewContent.id} .rating`) as HTMLDivElement;
    await new Stars(ratingDiv, this.reviewContent.rating).render();
       

    const editDialog = document.querySelector('.edit-dialog') as HTMLDialogElement;

    const editReviewButton = document.querySelector(`#review-${this.reviewContent.id} .button-edit-review`);
    editReviewButton?.addEventListener('click', () => {
      document.querySelector(`#review-${this.reviewContent.id}`)?.classList.add('staged-delete');
      editDialog.showModal();
    });

    const deleteDialog = document.querySelector('.delete-dialog') as HTMLDialogElement;

    const deleteReviewButton = document.querySelector(`#review-${this.reviewContent.id} .button-delete-review`) as HTMLButtonElement;
    
    deleteReviewButton?.addEventListener('click', () => {
      deleteDialog.showModal();
      document.querySelector(`#review-${this.reviewContent.id}`)?.classList.add('staged-delete');
    });
  }
}

export default Review;

