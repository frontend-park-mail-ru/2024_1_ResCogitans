import Stars from '@components/Stars/Stars';
import Base from  '@components/Base/Base';
import { UserProfile, SurveyGrade } from '@types/api';
import { get, post } from '@api/base';


const MOCK = {
    questions: [
        {
            questionID: 1,
            text: 'Hello1',
        },
        {
            questionID: 2,
            text: 'Hello2',
        },
        {
            questionID: 3,
            text: 'fdjsjguweqiw ejhqu2ewhuwqehu uhqe r',
        },
        {
            questionID: 4,
            text: 'rqej iiuer uir ijqer ueqru ',
        },
    ],
}


class SurveyForm {

    userData : UserProfile;

    parent: HTMLElement;
    currentID: number;
    questionData: any;
    stars: Stars;
    surveyData : SurveyGrade[];

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.currentID = 0;
        this.surveyData = [];

        this.userData = new Base(parent, '').userData;

        get('review/check').then((questionsResponse) => {
            this.questionData = questionsResponse.data;
            if (this.questionData.flag === false) {
                this.parent.classList.add('survey-hidden');
                return;
            }
            this.renderSurveyBegin();
        })
        
    }

    createElement(type: string, parent: HTMLElement, id?: string, className?: string, textContent?: string): HTMLElement {
        const element = document.createElement(type);
        if (id) {
            element.id = id;
        }
        if (className) {
            element.classList.add(className);
        }
        if (textContent) {
            element.textContent = textContent;
        }
        parent.appendChild(element);
        return element;
    }

    renderQuestion(id: number) {
        if (id > 0) {
            const questionID = this.questionData.questions[id - 1].questionID;
            const rating = this.stars.rating
            this.surveyData.push( { questionID, rating });
        }
        
        if (id >= this.questionData.questions.length) {
            this.renderFinal();
            return;
        } else if (id < 0) {
            this.renderSurveyBegin();
            this.currentID = 0;
        } else {

            const buttonContainer = document.querySelector('.button-container') as HTMLDivElement;

            buttonContainer.style.display = 'flex';

            const navigateButtons = document.querySelector('.navigate-buttons') as HTMLDivElement;

            if (!document.querySelector('#button-next')) {
                const nextButton = this.createElement('button', navigateButtons, `button-next`, 'button-primary', 'Далее') as HTMLButtonElement;
            }
            const questionLabel = document.querySelector('#question-name') as HTMLParagraphElement;
            const questionContent = document.querySelector('#question-description') as HTMLParagraphElement;

            questionLabel.textContent = `Вопрос ${id + 1} из ${this.questionData.questions.length}`;
            questionContent.textContent = this.questionData.questions[id].text;


            const submitButton = document.querySelector('#button-submit');
            submitButton?.remove();

            this.stars.setRating(0);
        }


    }

    renderFinal() {

        const buttonLabels = document.querySelector('.button-labels') as HTMLDivElement;
        buttonLabels.innerHTML = '';

        const questionLabel = document.querySelector('#question-name') as HTMLParagraphElement;

        questionLabel.textContent = `Спасибо за прохождение опроса!`;

        const questionContent = document.querySelector('#question-description') as HTMLParagraphElement;
        questionContent.textContent = '';

        const navigateButtons = document.querySelector('.navigate-buttons') as HTMLDivElement;
        navigateButtons.innerHTML = '';

        const buttonContainer = document.querySelector('.button-container') as HTMLDivElement;

        buttonContainer.style.display = 'none';

        const buttonPrev = this.createElement('button', navigateButtons, 'button-prev', 'button-primary', 'Назад') as HTMLButtonElement;

        buttonPrev.addEventListener('click', () => {
            this.renderQuestion(this.currentID -= 1);
        })

        const buttonSubmit = this.createElement('button', navigateButtons, 'button-submit', 'button-primary', 'Завершить') as HTMLButtonElement;


        buttonSubmit.addEventListener('click', () => {
            post('review/create', this.surveyData);
            this.parent.classList.add('survey-hidden');
        })

    }

    renderSurveyBegin() {
        const questionDivs = document.querySelectorAll('.question-content div');


        questionDivs.forEach((div) => div.innerHTML = '');

        const questionTitle = questionDivs[0] as HTMLDivElement;

        const questionLabel = this.createElement('p', questionTitle, 'question-name', 'h1', 'Опрос о качестве нашего сервиса') as HTMLParagraphElement;
        const questionContent = this.createElement('p', questionTitle, 'question-description', 'h2', 'Помогите нам стать лучше') as HTMLParagraphElement;

        const navigateButtons = document.querySelector('.navigate-buttons') as HTMLDivElement;
        navigateButtons.innerHTML = '';

        const nextButton = this.createElement('button', navigateButtons, `button-next`, 'button-primary', 'Начать') as HTMLButtonElement;
        const laterButton = this.createElement('button', navigateButtons, `button-later`, 'button', 'Позже') as HTMLButtonElement;

        const buttonContainer = document.querySelector('.button-container') as HTMLDivElement;

        buttonContainer.style.display = 'none';

        laterButton?.addEventListener('click', () => {
            this.parent.classList.add('survey-hidden');
        })


        nextButton.addEventListener('click', () => {
            console.log(this.currentID);
            this.renderButtons();
            this.renderQuestion(this.currentID);
        })
    }

    renderButtons() {

        const buttonContainer = document.querySelector('.button-container') as HTMLDivElement;

        this.stars = new Stars(buttonContainer, 0, true);

        this.stars.render();

        let i = 1;

        const navigateButtons = document.querySelector('.navigate-buttons') as HTMLDivElement;
        navigateButtons.innerHTML = '';

        const buttonPrev = this.createElement('button', navigateButtons, 'button-prev', 'button-primary', 'Назад') as HTMLButtonElement;
        const buttonNext = this.createElement('button', navigateButtons, 'button-next', 'button-primary', 'Далее') as HTMLButtonElement;

        buttonNext.addEventListener('click', () => {
            this.renderQuestion(this.currentID += 1);
        })

        buttonPrev.addEventListener('click', () => {
            this.renderQuestion(this.currentID -= 1);
        })

        const buttonLabels = document.querySelector('.button-labels') as HTMLDivElement;
        this.createElement('p', buttonLabels, '', '', 'Очень плохо');
        this.createElement('p', buttonLabels, '', '', 'Очень хорошо');

    }
}

function main() {
    const iframe = window.parent.document.querySelector('.iframe-container') as HTMLIFrameElement;
    new SurveyForm(iframe);
    return;
}

window.onload = main();