import * as $dom from './eval/$element';
import { factory } from './eval/generator';
import * as parse from './parse/index';
let htmlStr = ` <div data-angular name="angular" @change="go($event,'query')">
                    子元素:【文本】
                    <div &style="{width: 100px}" &name="block" @click="emit($event,123)"></div>
                </div>
                <p>我是一{{exp}}{{exp2}}</p>
                <!-- 注释信息-->`;
let parseResult = new parse.ParseHTML(htmlStr);

let component = (window.componentFn = new factory(parseResult, '#root'));
component.createFactory();
let paramsNames = Array.from(component.params);
let params = [];
for (let key of paramsNames) {
    params.push($dom[key]);
}
// 组件编译后的对象数据
let def = component.componentDef(...params);
let { selector } = def;
let rootEl = document.querySelector(selector);
def.template.call(def, 1, {});

rootEl.append(...instructionIFrameStates.root);

console.log(component);
