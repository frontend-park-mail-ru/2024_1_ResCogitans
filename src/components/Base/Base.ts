import Handlebars from 'handlebars';

class Base {

    parent : HTMLElement;

    constructor(parent : HTMLElement) {
        this.parent = parent;
    }

    async loadTemplate(componentName : string) {
        const templateName = `./${componentName}.hbs`;
        const templatesContext = require.context('./', true, /\.hbs$/);
        const template = templatesContext(templateName);

        const templateModule = await import(template);
        return templateModule.default;
    }

    async asHTML() {
        const template = await this.loadTemplate(this.constructor.name);
        const compiledTemplate = Handlebars.compile(template);
        const htmlView = compiledTemplate(this);
        return htmlView;
    }

    async render() {
        const htmlView = await this.asHTML();
        this.parent.insertAdjacentHTML('beforeend', htmlView);
      }

}

export default Base;