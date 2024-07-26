import { Injector, StaticProvider } from '../Injector/index';
import { Parse, ParseHtml } from '../parse/index';
import { BrowserRenderFns, Render } from '../render/dom';
import {
    collectRunDependency,
    createPlatform,
    PlatformRef,
} from './application';
import { PlatformCore } from './platform_core';
const Browser_Providers: StaticProvider[] = [
    {
        provide: Parse,
        useValue: ParseHtml,
    },
    {
        provide: Render,
        useValue: BrowserRenderFns,
    },
];

function PlatformBrowserDynamic(
    extraProvides: StaticProvider[] = []
): PlatformRef {
    let platFormProviders = collectRunDependency(
        PlatformCore,
        'browser',
        Browser_Providers
    );
    let platFomrInjector = Injector.create(platFormProviders(extraProvides));
    let platformRef = createPlatform(platFomrInjector);
    window['platformRef'] = platformRef;
    console.log(platformRef);

    return platformRef;
}

export { PlatformBrowserDynamic };
