import Handlebars from 'handlebars';

class Base {

    parent: HTMLElement;
    template: HandlebarsTemplateDelegate<any>;

    constructor(parent : HTMLElement) {
        this.parent = parent;
        this.template = () => '';
        this.loadTemplate();
    }

    async loadTemplate() {
        const templateName = `src/templates/${this.constructor.name}.hbs`;
        const templateModule = await import(templateName);
        this.template = Handlebars.compile(templateModule.default);
    }

   
    async render() {
        const htmlView = this.template(this);
        this.parent.insertAdjacentHTML('beforeend', htmlView);
    }

}

export default Base;