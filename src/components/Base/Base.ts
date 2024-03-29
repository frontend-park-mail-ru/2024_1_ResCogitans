import Handlebars from 'handlebars';

class Base {

    parent: HTMLElement;
    template: HandlebarsTemplateDelegate;

    constructor(parent : HTMLElement) {
        this.parent = parent;
    }

   
    async loadTemplate() {
        try {
            const templateModule = await import(`../../templates/${this.constructor.name}.hbs`);
            this.template = templateModule.default; // This is now a function
        } catch (error) {
            console.error("Failed to load template");
        }
    }

    async preRender(element? : HTMLElement) {
        await this.loadTemplate();
        const html = this.template(this);
        console.log(html);
        if (element !== undefined) {
            element.insertAdjacentHTML('beforeend', html);
        } else {
            this.parent.insertAdjacentHTML('beforeend', html);
        }
    }
   
    async render() {
       await this.preRender();
    }

}

export default Base;