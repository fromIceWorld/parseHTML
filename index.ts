import { Component } from './decorators/index';
import { Module } from './decorators/module';
import { PlatformBrowserDynamic } from './platform/browser';
class firstDirective {
    name = '第一个指令';
    static selector = '[data-angular]';
    init() {
        console.log('init');
    }
    insert(parent: Element, current: Element) {
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
@Component({
    selector: `app-child`,
    template: `app-child组件`,
    styles: '',
})
class ChilComponent {
    constructor() {}
}
@Component({
    selector: `#root`,
    styles: ``,
    template: `<div
            data-angular
            name="angular"
            &style="{width: dataWidth}"
            @change="go($event,'query')"
        >
            子元素:【文本】
            <div
                style="width: 100px;height: 100px;background-color:#e5e0e1;"
                &style="{width: dataWidth}"
                &name="block"
                @click="emit($event,123)"
            ></div>
        </div>
        <p
            class="forP bindClass2"
            &class="{bindClass1: class1,bindClass2: class2}"
        >
            我是:{{ exp }},{{ exp2 }}
        </p>
        <app-child></app-child>
        <!-- 注释信息-->`,
})
class MyComponent {
    exp = '第一个插值';
    exp2 = '第2个插值';
    block = 'com';
    dataWidth = '200px';
    class1 = true;
    class2 = false;
    constructor() {}
    emit(e: EventTarget, value: any) {
        console.log(e, value, this);
    }
}
@Module({
    declarations: [MyComponent, ChilComponent, firstDirective],
    imports: [],
    exports: [],
    providers: [],
    bootstrap: [MyComponent],
})
class AppModule {}

let platformRef = PlatformBrowserDynamic();
console.log(platformRef);
platformRef.bootstrapModule(AppModule);
