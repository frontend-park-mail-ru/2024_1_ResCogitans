import Base from '@components/Base/Base';

class Stars extends Base {
  rating: number;

  constructor(parent : HTMLElement, rating : number) {
    super(parent);
    this.rating = rating;
  }

  async render() {
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
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
}

export default Stars;
