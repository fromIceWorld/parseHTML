function Component(params) {
    let { selector, styles, template } = params;
    return function (target) {
        target.selector = selector;
        target.styles = styles;
        target.template = template;
        return target;
    };
}
export { Component };
