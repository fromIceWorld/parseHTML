import * as $dom from './eval/$element';
import { factory } from './eval/generator';
import * as parse from './parse/index';

class Component {
    bind() {}
}
class firstDirective {
    name = '第一个指令';
    static selector = '[data-angular]';
    init() {
        console.log('init');
    }
    insert(parent, current) {
        console.log('insert', parent, current);
    }
    beforePropertyUpdate() {
        console.log('beforePropertyUpdate');
    }
    afterPropertyUpdate() {
        console.log('afterPropertyUpdate');
    }
    afterHostUpdate() {
        console.log('afterHostUpdate');
    }
}
class ChilComponent {
    constructor() {}
    static selector = `app-child`;
    static template = `app-child组件`;
    static $getDefinition = (() => {
        let def;
        return () => {
            if (!def) {
                def = this.$compiler(this.template);
            }
            return def;
        };
    })();
    static $render = $dom;
    static $parse = parse;
    static $compiler(html: string) {
        let htmlTree = new this.$parse.ParseHTML(html);
        let componentFactory = new factory(htmlTree, this.selector);
        componentFactory.createFactory();
        let renderNeeds = Array.from(componentFactory.params).concat(
                'cacheInstructionIFrameStates'
            ),
            renderFn = [];
        // 获取需要的渲染函数
        for (let key of renderNeeds) {
            renderFn.push(this.$render[key]);
        }
        // 为template 提供渲染函数
        let componentDef = componentFactory.componentDef(...renderFn, this);
        console.log(componentDef);
        return componentDef;
    }
}
class MyComponent {
    exp = '第一个插值';
    exp2 = '第2个插值';
    block = 'com';
    dataWidth = '200px';
    class1 = true;
    class2 = false;
    constructor() {}
    emit(e, value) {
        console.log(e, value, this);
    }
    static selector = `#root`;
    static styles = ``;
    static template = ` <div data-angular name="angular" &style="{width: dataWidth}" @change="go($event,'query')">
                            子元素:【文本】
                            <div style="width: 100px;height: 100px;background-color:#e5e0e1;" &style="{width: dataWidth}"  &name="block" @click="emit($event,123)"></div>
                        </div>
                        <p class="forP bindClass2" &class="{bindClass1: class1,bindClass2: class2}">我是:{{exp}},{{exp2}}</p>
                        <app-child></app-child>
                        <!-- 注释信息-->`;

    static $getDefinition = (() => {
        let def;
        return () => {
            if (!def) {
                def = this.$compiler(this.template);
            }
            return def;
        };
    })();
    static directives = [firstDirective, ChilComponent];

    static $render = $dom;
    static $parse = parse;
    static $compiler(html: string) {
        let htmlTree = new this.$parse.ParseHTML(html);
        let componentFactory = new factory(htmlTree, this.selector);
        componentFactory.createFactory();
        let renderNeeds = Array.from(componentFactory.params).concat(
                'cacheInstructionIFrameStates'
            ),
            renderFn = [];
        // 获取需要的渲染函数
        for (let key of renderNeeds) {
            renderFn.push(this.$render[key]);
        }
        // 为template 提供渲染函数
        let componentDef = componentFactory.componentDef(...renderFn, this);
        console.log(componentDef);
        return componentDef;
    }
}

$dom.bootstrap(MyComponent);
