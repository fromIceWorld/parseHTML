import { elementType } from '../Enums/index';
import * as $dom from '../render/dom';
/**
 *  LView存储虚拟节点
 *  TView 存储 LView
 *  0: parent
 *  1: tNode
 *  2: $defComponent
 *  3: directives【当前组件下的指令，组件】，相当于childrens
 */
/**
 * 全局上下文，【指令状态，rootLView，rootTView】
 */
let rootLView = new Array(),
    rootTView = rootLView[0] || (rootLView[0] = new Array());
let instructionIFrameStates = (window['instructionIFrameStates'] = {
    rootLView,
    currentLView: rootLView,
    root:new Array(),
    elements:new Array()
});

function elementStart(tagName: string, index:number) {
    let currentLView = getCurrentLView(),
        currentTView = currentLView[0] || (currentLView[0] = new Array());
    let element = document.createElement(tagName);
    currentTView[index + 20] = element;
    linkParentChild(element);
    resolvetNode(tagName, index);
}
function linkParentChild(el:Element|Text){
    let {root,elements} = instructionIFrameStates;
    let {nodeType} = el;
    if(elements.length > 0){
        $dom.appendChild(elements[elements.length-1], el);
    }else{
        if(nodeType == elementType.Text){
            root.push(el)
        }
    }
    if(nodeType == elementType.Element){
        elements.push(el);
    }
}
function listener(eventName:string, callback, index:number) {
    let currentLView = getCurrentLView(),
        currentTView = (currentLView[0] || (currentLView[0] = new Array());
    let el = currentTView[index + 20];
    el.addEventListener(eventName, callback);
}
function elementEnd(tagName:string) {
    let {root,elements} = instructionIFrameStates;
    let elementStart = elements.pop();
    if(elementStart.localName == tagName){
        if(elements.length == 0){
            root.push(elementStart)
        }
    }
}
function text(content: string, index: number) {
    let currentLView = getCurrentLView(),
        currentTView = currentLView[0] || (currentLView[0] = new Array());
    let text = document.createTextNode(content);
    currentTView[index + 20] = text;
    linkParentChild(text)
}
/**
 * 
 * @param tagName string
 * @param attributes 
 */
function resolvetNode(tagName:string, attributes) {
    let currentLView = getCurrentLView();
}
function getCurrentLView() {
    let TView = instructionIFrameStates.currentLView;
    if (!TView) {
        TView = [];
        setCurrentTView(TView);
    }
    return TView;
}
function setCurrentTView(TView) {
    instructionIFrameStates.currentLView = TView;
}
export { elementStart, listener, elementEnd, text };

