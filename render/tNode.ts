import { elementType } from '../Enums/index';

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
class TextTNode {
    source: string;
    expression: string = '';
    bindings: Array<string> = new Array();
    tokens: Array<string> = new Array();
    type = elementType.Text;
    constructor(source: string) {
        this.source = source;
    }
}
class CommentTNode {
    source: string;
    type = elementType.Comment;
    constructor(source: string) {
        this.source = source;
    }
}
function getOrCreateTNode(tagName: string, index: number, LView) {
    if (LView[index + 20]) {
        return LView[index + 20];
    } else {
        return (LView[index + 20] = new Tn());
    }
}
export { ElementTNode, TextTNode, CommentTNode, getOrCreateTNode };
