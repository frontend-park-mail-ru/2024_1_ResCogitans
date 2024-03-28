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
        const templateName = `../../templates/${this.constructor.name}.hbs`;
        console.log(templateName);
        const templateModule = await require(templateName);
        this.template = Handlebars.compile(templateModule.default);
    }

   
    async render() {
        const htmlView = this.template(this);
        this.parent.insertAdjacentHTML('beforeend', htmlView);
    }

}

export default Base;