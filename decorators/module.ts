interface ModuleParams {
    declarations: Array<any>;
    imports: Array<any>;
    exports: Array<any>;
    providers: Array<any>;
    bootstrap: Array<any>;
}
abstract class blockModule {
    static declarations: Array<any>;
    static imports: Array<any>;
    static exports: Array<any>;
    static providers: Array<any>;
    static bootstrap: Array<any>;
}
function Module(params: ModuleParams) {
    let { declarations, imports, exports, providers, bootstrap } = params;
    return function (target) {
        target.$declarations = declarations;
        target.$imports = imports;
        target.$exports = exports;
        target.$providers = providers;
        target.$bootstrap = bootstrap;
        return target;
    };
}
export { Module };
