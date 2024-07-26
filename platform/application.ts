import { Instruction } from '../eval/instructions';
import { Injector, StaticInjector, StaticProvider } from '../Injector/index';

class PlatformRef {
    injector;
    registeredModules = new Map();
    rootModules = new Map();
    constructor(injector: StaticInjector) {
        this.injector = injector;
    }
    bootstrapModule(module: Function) {
        let { $bootstrap } = module;
        this.resolveModule(module);
        let moduleRef = new module();
        this.rootModules.set(module, moduleRef);
        if ($bootstrap.length > 0) {
            this.bootstrapComponent($bootstrap[0]);
        }
    }
    bootstrapComponent(rootComponent: Function) {
        Instruction.bootstrap(rootComponent);
    }
    resolveModule(module: Function) {
        // 解析模块及 imports的模块，将组件/指令/管道  组合到一起，建立虚拟的 TView【module】，
        // 虚拟的 TView【module】，作为组件的顶级TView，以提供通用数据【组件，指令，render...】
        let { $declarations, $imports, $exports, $providers, $bootstrap } =
            module;
        let externalDeclarations = this.getExternalDeclarations($imports);
        let allDeclarations = $declarations.concat(externalDeclarations);
        let module_Injector = Injector.create($providers);
        let rootTView = Instruction.moduleInitTView(
            module_Injector,
            allDeclarations
        );
    }
    getExternalDeclarations(importModules: Array<any>) {
        let exportDeclarations = new Array();
        for (let module of importModules) {
            let { $imports, $exports } = module;
            exportDeclarations = exportDeclarations.concat(
                $exports,
                this.getExternalDeclarations($imports)
            );
        }
        return exportDeclarations;
    }
}
function collectRunDependency(
    parentPlatformProviders: StaticProvider[],
    name: string,
    providers: StaticProvider[]
): (extraProvides?: StaticProvider[]) => StaticProvider[] {
    let allProviders = parentPlatformProviders.concat(providers);
    return (extraProvides = []) => {
        return allProviders.concat(extraProvides);
    };
}
function createPlatform(injector: Injector) {
    return injector.get(PlatformRef);
}
export { PlatformRef, collectRunDependency, createPlatform };
