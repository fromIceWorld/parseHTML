import { TViewIndex } from '../Enums/index';
import { popContext, pushContext } from '../eval/$element';
const offset = 20;
class TemplateView {
    [TViewIndex.Host] = null;
    [TViewIndex.RootElements] = new Array();
    [TViewIndex.Class] = null;
    [TViewIndex.LView] = new Array();
    [TViewIndex.Parent] = new Array();
    [TViewIndex.Children] = new Array();
    [TViewIndex.Context] = {};
    [TViewIndex.Directives] = new Array();
    [TViewIndex.ComponentDef] = new Array();
    [TViewIndex.Attributes] = new Array();
    [TViewIndex.Slots] = new Array();
    constructor() {}
    // 初始阶段，将view添加到 检测树
    attach() {
        pushContext(this);
        console.log(this);
        let def = this[TViewIndex.Class].$getDefinition();
        console.log(def);
        def.template(1, this[TViewIndex.Context]);
        let children = this[TViewIndex.ComponentDef];
        for (let child of children) {
            let tView = this[child + offset];
            tView.attach();
        }
        this[TViewIndex.Host].append(...this[TViewIndex.RootElements]);
        popContext();
    }
    // 变更检测
    detectChanges() {
        pushContext(this);
        let def = this[TViewIndex.Class].$getDefinition();
        def && def.template(2, this[TViewIndex.Context]);
        for (let child of this[TViewIndex.ComponentDef]) {
            let tView = this[child + offset];
            tView.detectChanges();
        }
        popContext();
    }
    checkChildren() {
        for (let child of this[TViewIndex.ComponentDef]) {
            let tView = this[child + offset];
            pushContext(tView);
            tView.detectChanges();
            popContext();
        }
    }
}
class LogicView extends Array {
    constructor() {
        super();
    }
}
export { TemplateView, LogicView, offset };
