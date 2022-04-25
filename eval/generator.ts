import { AttributeType } from '../Enums/index';
import { ParseHTML } from '../parse/index';
export { factory };
// 根据元素的属性，将静态，动态属性分离，生成create，update指令集，指向对应属性
class factory {
    selector;
    origin;
    elementIndex = 0;
    stacticAttrubutes: Array<Array<any>> = [];
    dynamicAttrubutes: Array<Array<any>> = [];
    dynamicStyle: Array<any> = [];
    dynamicClass: Array<any> = [];
    events: Array<any> = [];
    params: Set<string> = new Set();
    Attributes: Array<Array<string | number>> = new Array();
    createFn = ``;
    updateFn = ``;
    template: any;
    elements: Array<Element> = new Array();
    componentDef?: Object;
    constructor(htmlTokens: ParseHTML, selector: string) {
        this.origin = htmlTokens;
        this.selector = selector;
    }
    get $def() {
        if (!this.componentDef) {
            this.createFactory();
        }
        return this.componentDef;
    }
    createFactory() {
        let { root } = this.origin;
        for (let element of root) {
            let { type } = element;
            switch (type) {
                case 1:
                    this.createElement(element);
                    break;
                case 3:
                    this.createText(element);
                    break;
            }
        }
        this.createTemplateFn();
        this.createComponent();
    }
    createElement(elementNode) {
        this.params.add('elementStart');
        let { tagName, attributes, close, children } = elementNode;
        let elementFn = `elementStart('${tagName}',${this.elementIndex}`;
        this.createFn += elementFn + ');\n';
        this.handleAttributes(attributes);
        this.elementIndex++;
        // 子节点
        children.forEach((child) => {
            let { type } = child;
            switch (type) {
                case 1:
                    this.createElement(child);
                    break;
                case 3:
                    this.createText(child);
                    break;
            }
        });
        this.closeElement(elementNode);
    }
    handleAttributes(attrArray) {
        // 初始化属性列
        this.dynamicStyle[this.elementIndex] = new Array();
        this.dynamicClass[this.elementIndex] = new Array();
        this.stacticAttrubutes[this.elementIndex] = new Array();
        this.dynamicAttrubutes[this.elementIndex] = new Array();
        this.events[this.elementIndex] = new Array();
        for (let i = 0; i < attrArray.length; ) {
            if (attrArray[i + 1] == '=') {
                let pre = attrArray[i][0];
                switch (pre) {
                    case '@':
                        this.addListener(attrArray[i], attrArray[i + 2]);
                        break;
                    case '&':
                        this.addDynamicAttrubute(
                            attrArray[i],
                            attrArray[i + 2]
                        );
                        break;
                    default:
                        this.addStaticAttrubute(attrArray[i], attrArray[i + 2]);
                        break;
                }
                i += 3;
            } else {
                this.addStaticAttrubute(attrArray[i], '');
                i++;
            }
        }
        this.createAttribute(this.elementIndex);
    }
    closeElement(elementNode) {
        this.params.add('elementEnd');
        let { tagName } = elementNode;
        this.createFn += `elementEnd('${tagName}');\n`;
    }
    setStaticAttribute() {}
    setDynamicAttribute() {}
    // 创建文本
    createText(element) {
        this.params.add('text');
        let { source } = element;
        let fn = `text('${source}', ${this.elementIndex});\n`;
        this.createFn += fn;
        this.elementIndex++;
    }
    // 更新文本
    updateText(index) {
        this.params.add('text');
        let fn = `text(${index})`;
    }
    addStaticAttrubute(key, value) {
        let attribute = this.stacticAttrubutes[this.elementIndex];
        attribute.push(key, value);
    }
    addDynamicAttrubute(key, value) {
        let styles = this.dynamicStyle[this.elementIndex],
            classes = this.dynamicStyle[this.elementIndex],
            dynamicAttrubutes = this.dynamicAttrubutes[this.elementIndex];
        if (key == '&style') {
            styles.push(value);
        } else if (key == '&class') {
            classes.push(value);
        } else {
            dynamicAttrubutes.push(key.substring(1), value);
        }
    }
    // 为节点添加事件【解析对应的函数】
    addListener(eventName, callback) {
        this.params.add('listener');
        let events = this.events[this.elementIndex];
        events.push(eventName, callback);
        let [fn, params] = callback.replace(/[()]/g, ' ').split(' ');
        eventName = eventName.substring(1);
        let eventFn = `listener('${eventName}',function($event){
            return ctx['${fn}'](${params});
        },${this.elementIndex});\n`;
        this.createFn += eventFn;
    }
    // 根据创建函数，更新函数，组合成template函数;
    createTemplateFn() {
        this.template = new Function(
            'mode',
            'ctx',
            `
                if(mode & 1){
                    ${this.createFn}\n
                };
                if(mode & 2){
                    ${this.updateFn}\n
                };
            `
        );
    }
    createAttribute(index: number) {
        this.Attributes[index] = [];
        if (this.stacticAttrubutes[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.staticAttribute,
                ...this.stacticAttrubutes[index]
            );
        }
        if (this.dynamicStyle[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.dynamicStyle,
                ...this.dynamicStyle[index]
            );
        }
        if (this.dynamicClass[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.dynamicClass,
                ...this.dynamicClass[index]
            );
        }
        if (this.dynamicAttrubutes[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.staticAttribute,
                ...this.dynamicAttrubutes[index]
            );
        }
        if (this.events[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.events,
                ...this.events[index]
            );
        }
    }
    createComponent() {
        let componentDef = (this.componentDef = new Function(
            ...this.params,
            `
            return {
                selector:'${this.selector}',
                attributes:[${JSON.stringify(this.Attributes)}],
                template:${this.template}
            }
        `
        ));
        console.log(componentDef);
    }
}
