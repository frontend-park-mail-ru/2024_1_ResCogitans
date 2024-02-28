import Place from './Place';
import template from './Placelist.hbs'


const DATA = [
    {
        data: {
            url: '1.jpg',
            name: 'Attraction 1',
            rating: 4.5,
            description: 'Description of Attraction 1'
        }
    },
    {
        data: {
            url: '2.jpg',
            name: 'Attraction 2',
            rating: 3.8,
            description: 'Description of Attraction 2'
        }
    },
    {
        data: {
            url: './3.jpg',
            name: 'Attraction 3',
            rating: 5.0,
            description: 'Description of Attraction 3'
        }
    },

    {
        data: {
            url: '4.jpg',
            name: 'Attraction 4',
            rating: 4.0,
            description: 'Description of Attraction 4'
        }
    },
    {
        data: {
            url: '4.jpg',
            name: 'Attraction 4',
            rating: 4.0,
            description: 'Description of Attraction 4'
        }
    },
    {
        data: {
            url: '4.jpg',
            name: 'Attraction 4',
            rating: 4.0,
            description: 'Description of Attraction 4'
        }
    },
    {
        data: {
            url: '4.jpg',
            name: 'Attraction 4',
            rating: 4.0,
            description: 'Description of Attraction 4'
        }
    },
    {
        data: {
            url: '4.jpg',
            name: 'Attraction 4',
            rating: 4.0,
            description: 'Description of Attraction 4'
        }
    }
];


class Placelist {

    constructor(parent) {
        this.parent = parent;
        this.city = 'Paris';
    }

    getHTML() {
        return template(this.city);
    }

    render() {
        this.parent.insertAdjacentHTML('afterend', this.getHTML());
        const placelist = document.getElementById('list-places');
        for (let placeData of DATA) {
            new Place(placelist, placeData.data).render();
        }
    }
}

export default Placelist;