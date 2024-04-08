import Base from '@components/Base/Base';
import Stars from '@components/Stars/Stars';
import { ReviewContent } from 'src/types/api';

class Review extends Base {

  reviewContent : ReviewContent;

  isNotProfile : boolean;

  isOwn : boolean;
    
  constructor(parent : HTMLElement, reviewContent : ReviewContent, isNotProfile : boolean, isOwn : boolean) {
    super(parent);
    this.reviewContent = reviewContent;
    this.isNotProfile = isNotProfile;
    this.isOwn = isOwn;
  }

  async render() {
    await this.preRender();
    const ratingDiv = document.querySelector(`#review-${this.reviewContent.id} .rating`) as HTMLDivElement;
    await new Stars(ratingDiv, this.reviewContent.rating).render();
       
    const editReviewButton = document.querySelector(`#review-${this.reviewContent.id} .button-edit-review`);
    editReviewButton?.addEventListener('click', () => {
      alert(this.reviewContent.id);
    });

    const deleteReviewButton = document.querySelector(`#review-${this.reviewContent.id} .button-delete-review`);
    deleteReviewButton?.addEventListener('click', () => {
      alert(this.reviewContent.id);
    });
  }
}

export default Review;

// <!-- Простой попап диалог с формой -->
// <dialog id="favDialog">
//   <form method="dialog">
//     <section>
//       <p>
//         <label for="favAnimal">Favorite animal:</label>
//         <select id="favAnimal">
//           <option></option>
//           <option>Brine shrimp</option>
//           <option>Red panda</option>
//           <option>Spider monkey</option>
//         </select>
//       </p>
//     </section>
//     <menu>
//       <button id="cancel" type="reset">Cancel</button>
//       <button type="submit">Confirm</button>
//     </menu>
//   </form>
// </dialog>

// <menu>
//   <button id="updateDetails">Update details</button>
// </menu>

// <script>
//   (function () {
//     var updateButton = document.getElementById("updateDetails");
//     var cancelButton = document.getElementById("cancel");
//     var favDialog = document.getElementById("favDialog");

//     // Update button opens a modal dialog
//     updateButton.addEventListener("click", function () {
//       favDialog.showModal();
//     });

//     // Form cancel button closes the dialog box
//     cancelButton.addEventListener("click", function () {
//       favDialog.close();
//     });
//   })();
// </script>
