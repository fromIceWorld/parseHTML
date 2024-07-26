import { Decorator } from './index';
interface ComponentParams {
    selector: string;
    styles: string;
    template: string;
}
abstract class blockComponent {
    static selector: string;
    static styles: string;
    static template: string;
}
function Component(params: ComponentParams) {
    let { selector, styles, template } = params;
    return function (target) {
        target.selector = selector;
        target.styles = styles;
        target.template = template;
        target.$type = Decorator.Component;
        return target;
    };
}
export { Component };
