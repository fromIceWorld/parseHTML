import * as parse from './parse/index';
class Component {
    $render;
    $parse = parse;
}
class MyComponent extends Component {
    exp = '第一个插值';
    exp2 = '第2个插值';
    constructor() {}
    static selector = `app-child`;
    static styles = ``;
    static template = ` <div data-angular name="angular" @change="go($event,'query')">
                            子元素:【文本】
                            <div &style="{width: 100px}" &name="block" @click="emit($event,123)"></div>
                        </div>
                        <p>我是一{{exp}}{{exp2}}</p>
                        <!-- 注释信息-->`;
    static $getDefinition;
    static TView;
    static LView;
}
class TNode {
    constructor(tagName, attributes) {
        this.tagName = tagName;
        this.attributes = {};
    }
}
TNode = {
    tagName: '',
    attributes: {
        name: {
            type: 1,
            preVal: null,
            curVal: null,
        },
    },
};
