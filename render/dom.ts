import { InjectionToken } from '../Injector/index';

const BrowserRenderFns = {
    appendChild(parent: Element, child: Element | Text) {
        parent.appendChild(child);
    },
};
const Render = new InjectionToken('Browser Render(DOM)');
export { BrowserRenderFns, Render };
