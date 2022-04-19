enum NodeType {
    Element = 1,
    Attr,
    Text = 3,
    CDATASection,
    Comment = 8,
}
class ElementError {
    position;
    description: string;
    constructor(position: { row: number; col: number }, description: string) {
        this.position = position;
        this.description = description;
    }
}
class position {
    row;
    col;
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}
class Element {
    tagName: string;
    attrArray: Array<string>;
    close: boolean;
    parent: any = null;
    children: Array<any> = [];
    NodeType = NodeType.Element;
    constructor(tagName: string, attrArray: Array<string>, close: boolean) {
        this.tagName = tagName;
        this.attrArray = attrArray;
        this.close = close;
    }
}
class Text {
    content: string;
    NodeType = NodeType.Text;
    constructor(content: string) {
        this.content = content;
    }
}
class Comment {
    content: string;
    NodeType = NodeType.Comment;
    constructor(content: string) {
        this.content = content;
    }
}
class ParseHTML {
    root: Array<Element> = [];
    startIndex = 0;
    origin: string = '';
    row = 1;
    col = 1;
    elements: Array<any> = [];
    errors: Array<any> = [];
    constructor(origin: string) {
        this.origin = origin;
        this.parse();
    }
    parse() {
        while (this.startIndex < this.origin.length) {
            // 以 <开头的 标签
            if (this.origin[this.startIndex] == '<') {
                if (this.origin.startsWith('<!--', this.startIndex)) {
                    // 注释
                    this.attempNotes();
                } else if (
                    this.startIndex + 2 < this.origin.length &&
                    this.origin[this.startIndex + 1] == '/' &&
                    this.origin[this.startIndex + 1] !== ' '
                ) {
                    // 闭合标签
                    this.attemptClosedElement();
                } else if (
                    this.startIndex + 1 < this.origin.length &&
                    this.origin[this.startIndex + 1] !== ' '
                ) {
                    // 无效的标签，就是文本 =>【< div>】
                    this.attemptOpenTag();
                } else {
                    // 无效的标签，就是文本 =>【< div>】
                    this.attempText();
                }
            } else {
                // 文本
                this.attempText();
            }
        }
    }
    linkParentChild(element: any) {
        if (this.elements.length > 0) {
            let parent = this.elements[this.elements.length - 1];
            parent.children.push(element);
            element.parent = parent;
        }
        this.insert(element);
    }
    // 是否将节点推入栈中
    insert(element: any) {
        let { NodeType: type, parent } = element;
        if (type !== NodeType.Text && type !== NodeType.Comment) {
            this.elements.push(element);
        } else {
            if (!parent) {
                this.root.push(element);
            }
        }
    }
    // 过滤空字符,存储有效的attribute
    filterWhiteSpace(container: Array<string>, str: string) {
        if (str !== '') {
            container.push(str);
        }
    }
    closedElement(tagName: string) {
        if (this.elements.length > 0) {
            if (this.elements[this.elements.length - 1].tagName == tagName) {
                let element = this.elements.pop();
                if (this.elements.length == 0) {
                    this.root.push(element);
                }
            } else {
                this.cacheError(tagName, this.row, this.col);
            }
        } else {
            this.cacheError(tagName, this.row, this.col);
        }
    }
    cacheError(tagName: string, row: number, col: number) {
        this.errors.push(
            new ElementError(
                new position(row, col),
                `${tagName} 未找到开始标签`
            )
        );
    }
    // 闭合标签
    attemptClosedElement() {
        let endIndex = this.origin.indexOf('>', this.startIndex);
        if (endIndex == -1) {
            this.attempText();
        } else {
            let closeTagName = this.origin.substring(
                this.startIndex + 2,
                endIndex
            );
            this.startIndex = endIndex + 1;
            this.closedElement(closeTagName);
        }
    }
    // 处理文本数据
    attempText() {
        // 找下一个 <
        let endIndex = this.origin.indexOf('<', this.startIndex + 1),
            elementText;
        if (endIndex == -1) {
            // 未找到标签，就是文本
            elementText = new Text(this.origin.substring(this.startIndex));
            this.startIndex = this.origin.length;
        } else {
            elementText = new Text(
                this.origin.substring(this.startIndex, endIndex)
            );
            this.startIndex = endIndex;
        }
        // 将当前元素插入树
        this.linkParentChild(elementText);
    }
    // 找到value的闭合区域： name = "**" 中的 value: "**"
    attemptValue(start: number) {
        let endIndex = this.origin.indexOf(this.origin[start], start + 1);
        return endIndex;
    }
    // 开始标签
    attemptOpenTag() {
        let from = (this.startIndex = 1); // 越过 '<'
        let key = '',
            attrs = [];
        let elementStart;
        while (from < this.origin.length) {
            let code = this.origin[from];
            // 处理单/双引号
            if (code == '"' || code == "'") {
                let marksEnd = this.attemptValue(from);
                // 无闭合的双引号，就是文本
                if (marksEnd == -1) {
                    key += code;
                    from++;
                } else {
                    // 存储 value值
                    this.filterWhiteSpace(
                        attrs,
                        this.origin.substring(from, marksEnd + 1)
                    );
                    from = marksEnd + 1;
                }
            } else if (code == ' ' || code == '=') {
                if (key !== '') {
                    attrs.push(key);
                    key = '';
                }
                if (code == ' ') {
                    from = this.crossWhiteSpace(from);
                } else {
                    attrs.push('=');
                    from++;
                }
            } else if (code == '>') {
                // 遇到结束符号>, 存储最后解析的属性
                this.filterWhiteSpace(attrs, key);
                from++;
                break;
            } else {
                key += code;
                from++;
            }
        }
        // 当解析属性时，越界，说明未遇到>,当前解析的字符非标签，而是文本
        if (from == this.origin.length) {
            elementStart = new Text(this.origin.substring(this.startIndex));
        } else {
            let tagName = attrs[0],
                closed = attrs[attrs.length - 1] == '/',
                attributes = attrs.slice(
                    1,
                    closed ? attrs.length - 1 : attrs.length
                );
            if (tagName !== ' ') {
                // 检测标签有效性
                elementStart = new Element(tagName, attributes, closed);
                // 自闭和标签
                if (closed) {
                    this.closedElement(tagName);
                } else {
                    this.insert(elementStart);
                }
                // 移动光标
                this.startIndex = from;
            } else {
                // 标签无效时，按照文本处理；
                this.attempText();
            }
        }
    }
    // 解析注释
    attempNotes() {
        // 注释/文本
        let closedIndex = this.origin.indexOf('-->', this.startIndex);
        if (closedIndex !== -1) {
            let content = this.origin.substring(
                this.startIndex + 4,
                closedIndex
            );
            let ElementComment = new Comment(content);
            this.linkParentChild(ElementComment);
            this.startIndex = closedIndex + 3;
        } else {
            this.attempText();
        }
    }
    // 去除多余空白字符
    crossWhiteSpace(start: number) {
        while (this.origin[start] == ' ') {
            start++;
        }
        return start;
    }
}
export { ParseHTML };
