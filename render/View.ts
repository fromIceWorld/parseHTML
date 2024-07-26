import { TViewIndex } from '../Enums/index';
import { compiler } from '../eval/generator';
import { Instruction } from '../eval/instructions';
const offset = 20;
class TemplateView extends Array {
    [TViewIndex.Host]: Element;
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
    [TViewIndex.Compiler]: compiler;

    constructor() {
        super();
        Object['setPrototypeOf'](this, TemplateView.prototype);
    }
    $getDefinition = (() => {
        let def: { template: Function };
        return () => {
            if (!def) {
                def = this[TViewIndex.Compiler].transform(
                    this[TViewIndex.Class]
                );
            }
            return def;
        };
    })();
    // 初始阶段，将view添加到 检测树
    attach() {
        Instruction.pushContext(this);
        let def = this.$getDefinition();
        def.template(1, this[TViewIndex.Context]);
        let children = this[TViewIndex.ComponentDef];
        for (let child of children) {
            let tView = this[child + offset];
            tView.attach();
        }
        this[TViewIndex.Host].append(...this[TViewIndex.RootElements]);
        Instruction.popContext();
    }
    // 变更检测
    detectChanges() {
        Instruction.pushContext(this);
        let def = this.$getDefinition();
        def && def.template(2, this[TViewIndex.Context]);
        for (let child of this[TViewIndex.ComponentDef]) {
            let tView = this[child + offset];
            tView.detectChanges();
        }
        Instruction.popContext();
    }
    // 检测子视图
    checkChildren() {
        for (let child of this[TViewIndex.ComponentDef]) {
            let tView = this[child + offset];
            Instruction.pushContext(tView);
            tView.detectChanges();
            Instruction.popContext();
        }
    }
}
class LogicView extends Array {
    constructor() {
        super();
    }
}
export { TemplateView, LogicView, offset };
