import { resolveSelector } from '../common/index';
import { AttributeType, elementType, TViewIndex } from '../Enums/index';
import * as $dom from '../render/dom';
import { TNode } from '../render/tNode';
import { offset, TemplateView } from '../render/View';

/**
 *  TView 存储虚拟节点:[TNode]
 *  LView 存储真实DOM:[DOM]
 */
/**
 * 全局上下文，【指令状态，rootLView，rootTView】
 */
let rootTView = new TemplateView();
rootTView[TViewIndex.Host] = document.createElement('app-block');
rootTView[TViewIndex.ComponentDef] = [0];

let elementStack = new Array();
let instructionIFrameStates = (window['instructionIFrameStates'] = {
    currentTView: rootTView,
    RootElements: new Array(),
    attributes: new Array(),
    directives: new Array(),
});
// 将组件挂载到当前视图上
function loadComponent(tView: TemplateView) {
    tView.attach();
}
function pushContext(tView) {
    setCurrentTView(tView);
}
function popContext() {
    let currentTView = getCurrentTView(),
        preTView = currentTView[TViewIndex.Parent][0];
    setCurrentTView(preTView);
    instructionIFrameStates.RootElements = preTView[TViewIndex.RootElements];
    console.log(instructionIFrameStates.currentTView);
}
function bootstrap(component) {
    let currentTView = getCurrentTView(),
        root = currentTView[TViewIndex.Host];
    let child = createTView(component, root);
    currentTView[offset] = child;
    loadComponent(child);
    document.body.append(instructionIFrameStates.currentTView[TViewIndex.Host]);
    child.detectChanges();
}
// 与指令集上下文与class建立联系
function cacheInstructionIFrameStates(componentType, attributes) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView];
    let { directives } = componentType;
    let def = componentType.$getDefinition();
    instructionIFrameStates.attributes = attributes;
    currentTView[TViewIndex.Attributes] = attributes;
    // currentTView[TViewIndex.Directives] = directives;
    instructionIFrameStates.directives = directives;
    return instructionIFrameStates;
}
function elementStart(tagName: string, index: number) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView];
    let element = document.createElement(tagName);
    currentLView[index + offset] = element;
    resolvetNode(tagName, index);
    directivesHook(index, 'init');
    linkParentChild(element, index);
    directivesHook(index, 'insert');
}
function resolvetDirective(index: number) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        provideDirectives = instructionIFrameStates.directives;
    let nativeDOM = currentLView[index + offset],
        TNode = currentTView[index + offset];
    let { tagName, directives, components } = TNode;
    for (let directive of provideDirectives) {
        let { selector } = directive;
        let [key, value] = resolveSelector(selector);
        if (key == tagName && value == null) {
            // components.push({
            //     directive,
            //     context: new directive(),
            // });
            currentTView[TViewIndex.ComponentDef].push(index);
            // 将原来的dom，更改为TView，以标明节点为组件
            currentTView[index + offset] = createTView(directive, nativeDOM);
        } else if (nativeDOM.getAttribute(key) == value) {
            directives.push(new directive());
            currentTView[TViewIndex.Directives].push(index);
        }
    }
}
function createTView(component, host) {
    let currentTView = getCurrentTView(),
        tView = new TemplateView();
    tView[TViewIndex.Host] = host;
    tView[TViewIndex.Class] = component;
    tView[TViewIndex.Context] = new component();
    tView[TViewIndex.Parent] = [currentTView];
    return tView;
}
function linkParentChild(el: Element | Text, index: number) {
    let { RootElements } = instructionIFrameStates;
    let { nodeType } = el;
    if (elementStack.length > 0) {
        parent = elementStack[elementStack.length - 1];
        $dom.appendChild(parent, el);
    } else {
        if (nodeType == elementType.Text) {
            RootElements.push(el);
        }
    }
    if (nodeType == elementType.Element) {
        elementStack.push(el);
    }
}
function directivesHook(index: number, lifecycle: string) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        { directives } = currentTView[index + offset];
    let dom = currentLView[index + offset],
        parent = dom.parent;
    directives &&
        directives.forEach((directive) => {
            if (typeof directive[lifecycle] == 'function') {
                directive[lifecycle](parent, dom);
            }
        });
}
function listener(eventName: string, callback: Function, index: number) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView];
    let el = currentLView[index + offset];
    el.addEventListener(eventName, callback);
}
function elementEnd(tagName: string) {
    let { RootElements } = instructionIFrameStates;
    let elementStart = elementStack.pop();
    if (elementStart.localName == tagName) {
        if (elementStack.length == 0) {
            RootElements.push(elementStart);
        }
    }
}
function creatText(index: number, ...content) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView];
    let text = document.createTextNode(content);
    currentLView[index + offset] = text;
    currentTView[index + offset] = [
        null,
        ...instructionIFrameStates.attributes[index],
    ];

    // 解析 text，确定text的属性
    // resolveText()
    linkParentChild(text, index);
}
function updateText(index: number, ...content) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView];
    let element = currentLView[index + offset];
    let newContent = content.join('');
    if (element.textContent !== newContent) {
        element.textContent = newContent;
    }
}
function propertyFn(index: number, type: number, key: string, fn: Function) {
    let currentTView = getCurrentTView();
    let TNode = currentTView[index + offset];
    TNode.addDynamicAttrubute(type, key, fn);
}
function updateProperty(index: number) {
    directivesHook(index, 'beforePropertyUpdate');
    let TNode = getTNode(index);
    let { dynamicAttributesFn } = TNode;
    let [attributes, stylesFn, classFn] = dynamicAttributesFn;
    if (attributes.length > 0) {
        updateProp(index, attributes);
    }
    if (stylesFn.length > 0) {
        updateStyle(index, stylesFn);
    }
    if (classFn.length > 0) {
        updateClass(index, classFn);
    }
    directivesHook(index, 'afterPropertyUpdate');
}
function getTNode(index: number) {
    let currentTView = getCurrentTView();
    return currentTView[index + offset];
}
function updateStyle(index: number, fns: Array<Function>) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        nativeDOM = currentLView[index + offset],
        styleMap = nativeDOM.attributeStyleMap,
        context = currentTView[TViewIndex.Context],
        obj = {};
    fns.forEach((fn) => {
        Object.assign(obj, fn(context));
    });
    for (let key of Object.keys(obj)) {
        styleMap.set(key, obj[key]);
    }
}
function updateClass(index: number, fns: Array<Function>) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        context = currentTView[TViewIndex.Context],
        nativeDOM = currentLView[index + offset];
    let classString = nativeDOM.getAttribute('class') || '',
        classObj = {},
        resultFn = {},
        classMerge = '';
    classString &&
        classString.split(' ').map((key: string) => {
            if (key.trim() !== '') {
                classObj[key] = true;
            }
        });
    fns.forEach((fn) => {
        Object.assign(resultFn, fn(context));
    });
    classObj = Object.assign(classObj, resultFn);
    for (let key of Object.keys(classObj)) {
        if (classObj[key]) {
            classMerge += `${key} `;
        }
    }
    nativeDOM.setAttribute('class', classMerge);
}
function updateProp(index: number, attributes) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        nativeDOM = currentLView[index + offset],
        context = currentTView[TViewIndex.Context];
    attributes.forEach((attributeObj) => {
        let { key, fn } = attributeObj;
        nativeDOM.setAttribute(key, fn(context));
    });
}
/**
 *
 * @param tagName string
 * @param index number
 */
function resolvetNode(tagName: string, index: number) {
    let currentTView = getCurrentTView(),
        currentLView = currentTView[TViewIndex.LView],
        nativeDOM = currentLView[index + offset],
        attributes = currentTView[TViewIndex.Attributes][index] || [];
    let attributesMap = {
        staticAttribute: new Map(),
        dynamicAttrubute: new Map(),
        style: new Map(),
        dynamicStyle: new Map(),
        class: new Map(),
        dynamicClass: new Map(),
        event: new Map(),
    };
    let current;
    for (let i = 0; i < attributes.length; ) {
        if (AttributeType[attributes[i]] !== undefined) {
            current = attributesMap[String(AttributeType[attributes[i]])];
            i++;
        }
        current?.set(attributes[i], attributes[i + 1]);
        i += 2;
    }
    // 静态数据
    for (let key of attributesMap['staticAttribute'].keys()) {
        nativeDOM.setAttribute(key, attributesMap['staticAttribute'].get(key));
    }
    // 事件
    currentTView[index + offset] = new TNode(tagName, attributesMap);
    resolvetDirective(index);
}
function getCurrentLView() {
    let TView = getCurrentTView();
    return TView[TViewIndex.LView];
}
function getCurrentTView() {
    let TView = instructionIFrameStates.currentTView;
    if (!TView) {
        TView = new TemplateView();
        setCurrentTView(TView);
    }
    return TView;
}
function setCurrentTView(TView: TemplateView) {
    instructionIFrameStates.currentTView = TView;
    instructionIFrameStates.RootElements = TView[TViewIndex.RootElements];
}

export {
    elementStart,
    listener,
    elementEnd,
    creatText,
    updateText,
    propertyFn,
    updateProperty,
    cacheInstructionIFrameStates,
    bootstrap,
    loadComponent,
    instructionIFrameStates,
    pushContext,
    popContext,
};
