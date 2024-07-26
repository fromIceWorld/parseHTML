import { AttributeType, elementType } from '../Enums/index';
import { TemplateView } from './View';
interface Attributes {
    [prop: string]: {
        preValue: any;
        currentValue: any;
    };
}
/**
 * dynamicAttrubute: [{key,fn}]
 * dynamicStyle: [fn]
 * dynamicClass: [fn]
 */
class TNode {
    tagName: string;
    attributes: Object;
    directives = [];
    components = [];
    TView?: TemplateView;
    dynamicAttributesFn = Array.from(new Array(3), () => new Array());
    constructor(tagName: string, attributes: Object) {
        this.tagName = tagName;
        this.attributes = attributes;
    }
    addDynamicAttrubute(type: number, key: string, fn: Function) {
        if (type == AttributeType.dynamicAttrubute) {
            this.dynamicAttributesFn[type].push({ key, fn });
        } else {
            this.dynamicAttributesFn[type].push(fn);
        }
    }
}

class ElementTNode {
    tagName?: string;
    index: number | undefined;
    localNames: Array<string> = new Array();
    attributes: Array<string> = new Array();
    children: Array<ElementTNode> = new Array();
    native?: Element;
    type: number = elementType.Element;
    constructor(tagName: string, attributes: Array<string>) {
        this.tagName = tagName;
        this.attributes = attributes;
    }
}
// 根据输入字符串，将动态数据与静态数据分割
class TextTNode {
    source: string;
    expression: string = '';
    bindings: Array<string> = new Array();
    tokens: Array<string> = new Array();
    type = elementType.Text;
    constructor(source: string) {
        this.source = source;
        this.splitText();
    }
    splitText() {
        let i = 0,
            j = this.source.length - 1;
        while (i < j) {
            let BracesLeft = this.source.indexOf('{{', i),
                BracesRight = -1;
            if (BracesLeft >= 0) {
                BracesRight = this.source.indexOf('}}', BracesLeft);
            }
            if (BracesLeft >= 0 && BracesRight >= 0) {
                this.tokens.push(`"${this.source.substring(i, BracesLeft)}"`);
                this.tokens.push(
                    `ctx["${this.source.substring(
                        BracesLeft + 2,
                        BracesRight
                    )}"]`
                );
                this.bindings.push(
                    `${this.source.substring(BracesLeft + 2, BracesRight)}`
                );
                i = BracesRight + 2;
            } else {
                this.tokens.push(`"${this.source.substring(i)}"`);
                i = j;
            }
        }
    }
}
class CommentTNode {
    source: string;
    type = elementType.Comment;
    constructor(source: string) {
        this.source = source;
    }
}
function getOrCreateTNode(tagName: string, index: number, TView: TemplateView) {
    if (TView[index + 20]) {
        return TView[index + 20];
    } else {
        // return (LView[index + 20] = new Tn());
    }
}
export { TNode, ElementTNode, TextTNode, CommentTNode, getOrCreateTNode };
