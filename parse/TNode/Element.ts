import { elementType } from '../Enum/index';
import { Position } from '../position';

/**
 * @param tagName 标签名称
 */
class ElementTNode {
    tagName: string;
    attributes: Array<string> = new Array();
    children: Array<ElementTNode> = new Array();
    type: number = elementType.Element;
    startPosition: Position;
    constructor(
        tagName: string,
        attributes: Array<string>,
        startPosition: Position
    ) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.startPosition = startPosition;
    }
}
export { ElementTNode };
