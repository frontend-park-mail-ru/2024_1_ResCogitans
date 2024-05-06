import Base from '@components/Base/Base';

class Stars {
  rating: number;

  parent : HTMLElement;

  isEditable: boolean;

  constructor(parent : HTMLElement, rating : number, isEditable: boolean = false) {
    this.parent = parent;
    this.rating = rating;
    this.isEditable = isEditable;
  }

  render() {
    if (this.parent.children.length === 5) this.parent.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.addEventListener('click', () => {
        this.setRating(i + 1); 
      });
      if (i < Math.floor(this.rating)) {
        star.classList.add('filled');
      } else if (i === Math.floor(this.rating) && this.rating % 1 >= 0.5) {
        star.classList.add('partial');
      } else {
        star.classList.add('empty');
      }
      this.parent.appendChild(star);
    }
  }

  setRating(rating: number) {
    if (!this.isEditable) return;
    this.parent.innerHTML = '';
    this.rating = rating;
    this.render();
  }

}

export default Stars;
