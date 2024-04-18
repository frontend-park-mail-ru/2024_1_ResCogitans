import Base from '@components/Base/Base';

class Stars extends Base {
  rating: number;

  isEditable: boolean;

  constructor(parent : HTMLElement, rating : number, isEditable: boolean = false) {
    super(parent);
    this.rating = rating;
    this.isEditable = isEditable;
  }

  async render() {
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.addEventListener('click', () => this.setRating(i + 1));
      if (i < Math.floor(this.rating)) {
        star.classList.add('filled');
      } else if (i === Math.floor(this.rating) && this.rating % 1 > 0.5) {
        star.classList.add('partial');
      } else {
        star.classList.add('empty');
      }
      this.parent.appendChild(star);
    }
  }

  setRating(rating: number) {
    if (!this.isEditable) return;
    this.rating = rating;
    this.parent.innerHTML = '';
    this.render();
  }
}

export default Stars;
