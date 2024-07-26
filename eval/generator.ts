import { AttributeType } from '../Enums/index';
import { InjectionToken } from '../Injector/index';
import { ParseHtml } from '../parse/index';
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
    createFn = `componentType.InstructionIFrameStates = cacheInstructionIFrameStates(componentType, attributes, ctx)\n`;
    updateFn = ``;
    template: any;
    elements: Array<Element> = new Array();
    componentDef: Function | null;
    constructor(htmlTokens: ParseHtml, selector: string) {
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
                    this.resolveText(element);
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
                    this.resolveText(child);
                    break;
            }
        });
        this.closeElement(elementNode);
    }
    handleText() {}
    handleAttributes(attrArray) {
        let hasDynamicAtribute = false;
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
                        hasDynamicAtribute = true;
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
        if (
            this.dynamicStyle[this.elementIndex].length > 0 &&
            this.dynamicClass[this.elementIndex].length > 0 &&
            this.dynamicAttrubutes[this.elementIndex].length > 0
        ) {
            this.createFn += `property(${this.elementIndex})`;
        }
        this.createAttribute(this.elementIndex);
        if (hasDynamicAtribute) {
            this.updateProperty();
        }
    }
    closeElement(elementNode) {
        this.params.add('elementEnd');
        let { tagName } = elementNode;
        this.createFn += `elementEnd('${tagName}');\n`;
    }
    setStaticAttribute() {}
    setDynamicAttribute() {}
    // resolveText(element){
    //     let {source, }
    // }
    // 解析 文本
    resolveText(text) {
        let { content, bindings = [], tokens = [] } = text;
        this.Attributes[this.elementIndex] = [content, bindings, tokens];
        if (bindings.length > 0) {
            this.createText(content);
            this.updateText(tokens);
        } else {
            this.createText(content);
        }
        this.elementIndex++;
    }
    // 创建文本
    createText(expression: string) {
        this.params.add('creatText');
        let fn = `creatText(${this.elementIndex},'${expression}');\n`;
        this.createFn += fn;
    }
    // 更新文本
    updateText(tokens) {
        this.params.add('updateText');
        let fn = `updateText(${this.elementIndex},${tokens.join(',')})`;
        this.updateFn += fn;
    }
    addStaticAttrubute(key, value) {
        let attribute = this.stacticAttrubutes[this.elementIndex];
        attribute.push(key, value);
    }
    addDynamicAttrubute(key, value) {
        let styles = this.dynamicStyle[this.elementIndex],
            classes = this.dynamicStyle[this.elementIndex],
            dynamicAttrubutes = this.dynamicAttrubutes[this.elementIndex],
            keyName = key.substring(1),
            propertyType;

        if (keyName == 'style') {
            styles.push(value);
            propertyType = AttributeType.dynamicStyle;
        } else if (keyName == 'class') {
            classes.push(value);
            propertyType = AttributeType.dynamicClass;
        } else {
            dynamicAttrubutes.push(keyName, value);
            propertyType = AttributeType.dynamicAttrubute;
        }
        this.addProperty(keyName, value, propertyType);
    }
    addProperty(key, value, propertyType) {
        this.params.add('propertyFn');
        // 根据表达式，直接生成目的值
        let target = `(context)=>{
            with(context){
                return ${value}
            }
        }`;
        this.createFn += `propertyFn(${this.elementIndex},${propertyType},'${key}',${target})\n`;
    }
    updateProperty() {
        this.params.add('updateProperty');
        this.updateFn += `updateProperty(${this.elementIndex})\n`;
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
                'style',
                ...this.dynamicStyle[index]
            );
        }
        if (this.dynamicClass[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.dynamicClass,
                'class',
                ...this.dynamicClass[index]
            );
        }
        if (this.dynamicAttrubutes[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.dynamicAttrubute,
                ...this.dynamicAttrubutes[index]
            );
        }
        if (this.events[index].length > 0) {
            this.Attributes[index].push(
                AttributeType.event,
                ...this.events[index]
            );
        }
    }
    createComponent() {
        let componentDef = (this.componentDef = new Function(
            ...Array.from(this.params),
            'cacheInstructionIFrameStates',
            'componentType',
            `
            let selector = '${this.selector}',
                attributes = ${JSON.stringify(this.Attributes)};
            return {
                selector,
                attributes,
                template:${this.template}
            }
        `
        ));
        console.log(componentDef);
    }
}
class compiler {
    parse;
    instructionFns;
    factory;
    constructor(
        parse: typeof ParseHtml,
        instructionFns: Object,
        factory: factory
    ) {
        this.parse = parse;
        this.instructionFns = instructionFns;
        this.factory = factory;
    }
    transform(component) {
        let { selector, template } = component;
        let htmlTokens = new this.parse(template);
        let componentFactory = new factory(htmlTokens, selector);
        componentFactory.createFactory();
        let paramsOfInstructionKey = Array.from(componentFactory.params).concat(
                'cacheInstructionIFrameStates'
            ),
            paramsOfInstruction = [];
        for (let key of paramsOfInstructionKey) {
            paramsOfInstruction.push(this.instructionFns[key as keyof Object]);
        }
        // 运行构造函数【生成组件的指令集函数】
        let componentDef = componentFactory.componentDef(
            ...paramsOfInstruction,
            component
        );
        console.log(componentDef);
        return componentDef;
    }
}
const factoryToken = new InjectionToken('编译转换函数,将html转换为指令集'),
    compilerToken = new InjectionToken(
        '组合指令集,收集[parse,factory,Instruction] 生成 compiler函数'
    );
export { factory, factoryToken, compiler, compilerToken };
