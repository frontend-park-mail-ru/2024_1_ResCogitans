declare module "*.hbs" {
    const content: string;
    export default content;
}

declare global {
    interface NodeRequire {
       context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp) => any;
    }
}
