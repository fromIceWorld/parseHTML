(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function Component(params) {
        var selector = params.selector, styles = params.styles, template = params.template;
        return function (target) {
            target.selector = selector;
            target.styles = styles;
            target.template = template;
            target.$type = Decorator.Component;
            return target;
        };
    }

    var Decorator;
    (function (Decorator) {
        Decorator[Decorator["Module"] = 0] = "Module";
        Decorator[Decorator["Component"] = 1] = "Component";
        Decorator[Decorator["Directive"] = 2] = "Directive";
    })(Decorator || (Decorator = {}));

    function Module(params) {
        var declarations = params.declarations, imports = params.imports, exports = params.exports, providers = params.providers, bootstrap = params.bootstrap;
        return function (target) {
            target.$declarations = declarations;
            target.$imports = imports;
            target.$exports = exports;
            target.$providers = providers;
            target.$bootstrap = bootstrap;
            return target;
        };
    }

    var THROW_IF_NOT_FOUND = {};
    var NullInjector = /** @class */ (function () {
        function NullInjector() {
        }
        NullInjector.prototype.get = function (token, notFoundValue) {
            if (notFoundValue === void 0) { notFoundValue = THROW_IF_NOT_FOUND; }
            if (notFoundValue == THROW_IF_NOT_FOUND) {
                var error = new Error("NullInjectorError: No provider for ".concat(token));
                error.name = 'NullInjectorError';
                throw error;
            }
            return notFoundValue;
        };
        return NullInjector;
    }());

    var currentInjector = new NullInjector();
    var Injector = /** @class */ (function () {
        function Injector() {
        }
        Injector.create = function (providers, parent) {
            if (parent === void 0) { parent = currentInjector; }
            var nextInjector = new StaticInjector(providers, parent);
            currentInjector = nextInjector;
            return nextInjector;
        };
        Injector.θθpro = function () {
            return currentInjector;
        };
        Injector.THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
        return Injector;
    }());
    var StaticInjector = /** @class */ (function () {
        function StaticInjector(provides, parent) {
            var _this = this;
            this.parent = parent;
            this.records = new Map();
            provides.forEach(function (provider) {
                var _a = resolveProvider(provider), token = _a.token, useNew = _a.useNew, fn = _a.fn, value = _a.value, deps = _a.deps;
                _this.records.set(token, {
                    token: token,
                    useNew: useNew,
                    fn: fn,
                    value: value,
                    deps: deps,
                });
            });
        }
        StaticInjector.prototype.get = function (token, notFoundValue) {
            // 自定义依赖注入
            if (token['θθpro']) {
                return token['θθpro']();
            }
            var record = this.records.get(token);
            if (!record) {
                return this.parent.get(token, notFoundValue);
            }
            return this.instanceOnlyProvider(record);
        };
        StaticInjector.prototype.instanceOnlyProvider = function (record) {
            var _this = this;
            var token = record.token, useNew = record.useNew, fn = record.fn, value = record.value, deps = record.deps;
            if (value) {
                return value;
            }
            else if (useNew && fn instanceof Function) {
                var params_1 = new Array();
                deps &&
                    deps.forEach(function (dep) {
                        params_1.push(_this.get(dep));
                    });
                return (record.value = new (fn.bind.apply(fn, __spreadArray([void 0], __read(params_1), false)))());
            }
            else {
                var error = "provider Error:".concat(token, " provider \u683C\u5F0F\u9519\u8BEF");
                throw error;
            }
        };
        return StaticInjector;
    }());
    function resolveProvider(provider) {
        var provide = provider.provide, useClass = provider.useClass, useFactory = provider.useFactory, useValue = provider.useValue, deps = provider.deps;
        return {
            token: provide,
            useNew: !!(useClass || useFactory),
            fn: useClass || useFactory,
            value: useValue,
            deps: deps,
        };
    }
    var InjectionToken = /** @class */ (function () {
        function InjectionToken(desc) {
            this.desc = desc;
        }
        return InjectionToken;
    }());

    var elementType$1;
    (function (elementType) {
        elementType[elementType["Element"] = 1] = "Element";
        elementType[elementType["Attr"] = 2] = "Attr";
        elementType[elementType["Text"] = 3] = "Text";
        elementType[elementType["CDATASection"] = 4] = "CDATASection";
        elementType[elementType["Comment"] = 8] = "Comment";
    })(elementType$1 || (elementType$1 = {}));

    /**
     * @param row 行
     * @param column 列
     */
    var Position = /** @class */ (function () {
        function Position(row, column) {
            this.row = row;
            this.column = column;
        }
        return Position;
    }());

    var CommentTNode = /** @class */ (function () {
        function CommentTNode(content, startPosition, endPosition) {
            this.type = elementType$1.Comment;
            this.content = content;
            this.startPosition = startPosition;
            this.endPosition = endPosition;
        }
        return CommentTNode;
    }());

    /**
     * @param tagName 标签名称
     */
    var ElementTNode = /** @class */ (function () {
        function ElementTNode(tagName, attributes, startPosition) {
            this.attributes = new Array();
            this.children = new Array();
            this.type = elementType$1.Element;
            this.tagName = tagName;
            this.attributes = attributes;
            this.startPosition = startPosition;
        }
        return ElementTNode;
    }());

    /**
     * @param content 文本字符串
     * @param startPosition 开始位置
     * @param startPosition 结束位置
     */
    var TextTNode = /** @class */ (function () {
        function TextTNode(content, startPosition, endPosition) {
            this.type = elementType$1.Text;
            this.content = content;
            this.startPosition = startPosition;
            this.endPosition = endPosition;
        }
        return TextTNode;
    }());

    var EscapeCharacter = ['\n'];
    /**
     * @param template html字符串
     */
    var ParseTemplate = /** @class */ (function () {
        function ParseTemplate(template) {
            this.startIndex = 0;
            this.row = 1;
            this.column = 1;
            this.root = [];
            this.elements = [];
            this.errors = [];
            this.template = template;
            this.endIndex = template.length - 1;
            this.parse();
        }
        ParseTemplate.prototype.parse = function () {
            while (this.startIndex <= this.endIndex) {
                // 以 <开头的 标签
                if (this.template[this.startIndex] == '<') {
                    if (this.template.startsWith('<!--', this.startIndex)) {
                        // 注释
                        this.attempNotes();
                    }
                    else if (this.startIndex + 2 <= this.endIndex &&
                        this.template[this.startIndex + 1] == '/' &&
                        this.template[this.startIndex + 1] !== ' ') {
                        // 闭合标签
                        this.attemptClosedElement();
                    }
                    else if (this.startIndex + 1 <= this.endIndex &&
                        this.template[this.startIndex + 1] !== ' ') {
                        // 可能是标签 <div>
                        this.attemptOpenTag();
                    }
                    else {
                        // 无效的标签，就是文本 =>【< div>】
                        this.attempText();
                    }
                }
                else {
                    // 文本
                    this.attempText();
                }
            }
            console.log(this);
        };
        ParseTemplate.prototype.linkParentChild = function (element) {
            if (this.elements.length > 0) {
                var parent_1 = this.elements[this.elements.length - 1];
                parent_1.children.push(element);
                element.parent = parent_1;
            }
            this.insert(element);
        };
        // 是否将节点推入栈中
        ParseTemplate.prototype.insert = function (element) {
            var type = element.type, parent = element.parent;
            if (type !== elementType$1.Text && type !== elementType$1.Comment) {
                this.elements.push(element);
            }
            else {
                if (!parent) {
                    this.root.push(element);
                }
            }
        };
        // 过滤空字符,存储有效的attribute
        ParseTemplate.prototype.filterWhiteSpace = function (container, str) {
            if (str !== '') {
                container.push(str);
            }
        };
        ParseTemplate.prototype.closedElement = function (tagName) {
            var endPosition = this.position();
            if (this.elements.length > 0) {
                if (this.elements[this.elements.length - 1].tagName == tagName) {
                    var element = this.elements.pop();
                    element.endPosition = endPosition;
                    this.column++;
                    if (this.elements.length == 0) {
                        this.root.push(element);
                    }
                    return;
                }
            }
            // throw Error(
            //     `${tagName} 未找到匹配的开始标签。行:${this.row};列:${this.column};`
            // );
        };
        // 闭合标签: </tagName>
        ParseTemplate.prototype.attemptClosedElement = function () {
            var closed = this.matchString('>');
            if (closed) {
                var index = closed.index, nextColumn = closed.nextColumn, nextRow = closed.nextRow;
                var closeTagName = this.template.substring(this.startIndex + 2, index);
                this.row = nextRow;
                this.column = nextColumn;
                this.startIndex = index + 1;
                this.closedElement(closeTagName);
            }
            else {
                this.attempText();
            }
        };
        // 处理文本数据
        ParseTemplate.prototype.attempText = function () {
            // 找下一个 <
            var nextTag = this.matchString('<'), startPosition = this.position(), endPosition, elementText;
            if (nextTag) {
                var index = nextTag.index, nextColumn = nextTag.nextColumn, nextRow = nextTag.nextRow;
                endPosition = this.position(nextRow, nextColumn);
                elementText = new TextTNode(this.template.substring(this.startIndex, index).trim(), startPosition, endPosition);
                this.row = nextRow;
                this.column = nextColumn;
                this.startIndex = index;
            }
            else {
                endPosition = this.position(Infinity, Infinity);
                elementText = new TextTNode(this.template.substring(this.startIndex).trim(), startPosition, endPosition);
                this.column = Infinity;
                this.startIndex = this.template.length;
            }
            // 可能遇到无效文本:[\n]
            if (elementText.content && elementText.content.trim()) {
                // 将当前元素插入树
                this.linkParentChild(elementText);
            }
        };
        // 找到value的闭合区域： name = "**" 中的 value: "**"
        ParseTemplate.prototype.attemptValue = function (start) {
            var endIndex = this.template.indexOf(this.template[start], start + 1);
            return endIndex;
        };
        // 开始标签
        ParseTemplate.prototype.attemptOpenTag = function () {
            var from = this.startIndex + 1, row = this.row, column = this.column; // 越过 '<'
            var key = '', attrs = [];
            var elementStart;
            while (from <= this.endIndex) {
                var code = this.template[from];
                // 处理单/双引号
                if (code == '"' || code == "'") {
                    var marks = this.matchString(code, from + 1, column, row);
                    if (marks) {
                        var index = marks.index, nextColumn = marks.nextColumn, nextRow = marks.nextRow;
                        var value = this.template.substring(from + 1, index);
                        column = nextColumn;
                        row = nextRow;
                        attrs.push(value);
                        from = index + 1;
                    }
                    else {
                        // 无闭合的双引号，就是文本
                        key += code;
                        from++;
                        column++;
                    }
                }
                else if (code == ' ' ||
                    code == '\n' ||
                    code == '=' ||
                    code == '>') {
                    if (code == ' ' || code == '\n') {
                        if (code == '\n') {
                            row++;
                            column = 1;
                        }
                        this.filterWhiteSpace(attrs, key);
                        key = '';
                    }
                    else if (code == '=') {
                        attrs.push(key, '=');
                        key = '';
                    }
                    else if (code == '>') {
                        // 遇到结束符号>, 存储最后解析的属性,越过无效字符【' ','\n'】
                        this.filterWhiteSpace(attrs, key);
                        from++;
                        column++;
                        break;
                    }
                    var _a = this.crossWhiteSpace(from + 1, row, column + 1), nextFrom = _a.nextFrom, nextColumn = _a.nextColumn, nextRow = _a.nextRow;
                    from = nextFrom;
                    column = nextColumn;
                    row = nextRow;
                }
                else {
                    key += code;
                    from++;
                    column++;
                }
            }
            // 当解析属性时，越界，说明未遇到>,当前解析的字符非标签，而是文本
            if (from == this.template.length) {
                elementStart = new TextTNode(this.template.substring(this.startIndex), this.position(row, column), this.position(Infinity, Infinity));
            }
            else {
                var tagName = attrs[0], closed_1 = attrs[attrs.length - 1] == '/', attributes = attrs.slice(1, closed_1 ? attrs.length - 1 : attrs.length);
                if (tagName !== ' ') {
                    var startPosition = this.position();
                    this.row = row;
                    this.column = column;
                    // 检测标签有效性
                    elementStart = new ElementTNode(tagName, attributes, startPosition);
                    // 自闭和标签
                    if (closed_1) {
                        this.closedElement(tagName);
                    }
                    else {
                        this.linkParentChild(elementStart);
                    }
                    // 移动光标
                    this.startIndex = from;
                }
                else {
                    // 标签无效时，按照文本处理；
                    this.attempText();
                }
            }
        };
        // 解析注释
        ParseTemplate.prototype.attempNotes = function () {
            // 注释/文本
            var closed = this.matchString('-->');
            if (closed) {
                var index = closed.index, nextRow = closed.nextRow, nextColumn = closed.nextColumn;
                var startoPosition = this.position(), content = this.template.substring(this.startIndex + 4, index);
                this.column = nextColumn;
                this.row = nextRow;
                var endPosition = this.position(), ElementComment = new CommentTNode(content, startoPosition, endPosition);
                this.linkParentChild(ElementComment);
                this.startIndex = index + 3;
                this.column++;
            }
            else {
                this.attempText();
            }
        };
        /**
         * 替代 indexOf函数【需要统计 row，column】
         *
         * @param str 查找的目标字符
         * @param from 起始点
         * @param column 行
         * @param row 列
         * @returns  index 目标索引; nextRow:行; nextColumn:列; offset: 下一个起始点
         *
         */
        ParseTemplate.prototype.matchString = function (str, from, column, row) {
            if (from === void 0) { from = this.startIndex; }
            if (column === void 0) { column = this.column; }
            if (row === void 0) { row = this.row; }
            var length = str.length;
            var i = from, j = from + length;
            while (i <= this.endIndex) {
                if (this.template.substring(i, j) == str) {
                    return {
                        index: i,
                        nextRow: row,
                        nextColumn: column + length - 1,
                    };
                }
                else {
                    // 换行字符
                    if (EscapeCharacter.includes(this.template[i])) {
                        row++;
                        column = 1;
                    }
                    else {
                        column++;
                    }
                }
                i++;
                j++;
            }
            return false;
        };
        ParseTemplate.prototype.position = function (row, column) {
            if (row === void 0) { row = this.row; }
            if (column === void 0) { column = this.column; }
            return new Position(row, column);
        };
        // 去除多余空白字符
        ParseTemplate.prototype.crossWhiteSpace = function (start, row, column) {
            while (this.template[start] == ' ' || this.template[start] == '\n') {
                if (this.template[start] == ' ') {
                    column++;
                }
                if (this.template[start] == '\n') {
                    row++;
                    column = 1;
                }
                start++;
            }
            return {
                nextFrom: start,
                nextRow: row,
                nextColumn: column,
            };
        };
        return ParseTemplate;
    }());
    window['parse'] = ParseTemplate;
    var Parse = new InjectionToken('依据特定规则解析html的class');

    var BrowserRenderFns = {
        appendChild: function (parent, child) {
            parent.appendChild(child);
        },
    };
    var Render = new InjectionToken('Browser Render(DOM)');

    /**
     * 属性选择器,id选择器,class选择器,节点选择器
     * @param selector [name="**"], #id, .classNameme, div
     * @returns
     */
    function resolveSelector(selector) {
        var kv = [];
        var pre = selector[0];
        if (pre == '#') {
            kv.push('id', selector.substring(1));
        }
        else if (pre == '.') {
            kv.push('class', selector.substring(1));
        }
        else if (pre == '[') {
            var _a = __read(selector
                .substring(1, selector.length - 1)
                .split('='), 2), key = _a[0], value = _a[1];
            // 处理 value "[name=angular]" 和 "[name = 'angular']" 一样
            if (value) {
                kv.push(key.trim(), value.replace(/['"]/g, '').trim());
            }
            else {
                kv.push(key.trim(), '');
            }
        }
        else {
            kv.push(selector, null);
        }
        return kv;
    }

    var AttributeType;
    (function (AttributeType) {
        AttributeType[AttributeType["dynamicAttrubute"] = 0] = "dynamicAttrubute";
        AttributeType[AttributeType["dynamicStyle"] = 1] = "dynamicStyle";
        AttributeType[AttributeType["dynamicClass"] = 2] = "dynamicClass";
        AttributeType[AttributeType["staticAttribute"] = 3] = "staticAttribute";
        AttributeType[AttributeType["style"] = 4] = "style";
        AttributeType[AttributeType["class"] = 5] = "class";
        AttributeType[AttributeType["event"] = 6] = "event";
    })(AttributeType || (AttributeType = {}));
    var DynamicType;
    (function (DynamicType) {
        DynamicType[DynamicType["dynamicAttrubute"] = 0] = "dynamicAttrubute";
        DynamicType[DynamicType["dynamicStyle"] = 1] = "dynamicStyle";
        DynamicType[DynamicType["dynamicClass"] = 2] = "dynamicClass";
    })(DynamicType || (DynamicType = {}));

    var elementType;
    (function (elementType) {
        elementType[elementType["Element"] = 1] = "Element";
        elementType[elementType["Attr"] = 2] = "Attr";
        elementType[elementType["Text"] = 3] = "Text";
        elementType[elementType["CDATASection"] = 4] = "CDATASection";
        elementType[elementType["Comment"] = 8] = "Comment";
    })(elementType || (elementType = {}));

    var TViewIndex;
    (function (TViewIndex) {
        TViewIndex[TViewIndex["Host"] = 0] = "Host";
        TViewIndex[TViewIndex["RootElements"] = 1] = "RootElements";
        TViewIndex[TViewIndex["LView"] = 2] = "LView";
        TViewIndex[TViewIndex["Class"] = 3] = "Class";
        TViewIndex[TViewIndex["Parent"] = 4] = "Parent";
        TViewIndex[TViewIndex["Context"] = 5] = "Context";
        TViewIndex[TViewIndex["Children"] = 6] = "Children";
        TViewIndex[TViewIndex["Render"] = 7] = "Render";
        TViewIndex[TViewIndex["Directives"] = 8] = "Directives";
        TViewIndex[TViewIndex["ComponentDef"] = 9] = "ComponentDef";
        TViewIndex[TViewIndex["Attributes"] = 10] = "Attributes";
        TViewIndex[TViewIndex["Slots"] = 11] = "Slots";
        TViewIndex[TViewIndex["Injector"] = 12] = "Injector";
        TViewIndex[TViewIndex["Declarations"] = 13] = "Declarations";
        TViewIndex[TViewIndex["Compiler"] = 14] = "Compiler";
    })(TViewIndex || (TViewIndex = {}));
    var LViewIndex;
    (function (LViewIndex) {
        LViewIndex[LViewIndex["Render"] = 0] = "Render";
    })(LViewIndex || (LViewIndex = {}));

    /**
     * dynamicAttrubute: [{key,fn}]
     * dynamicStyle: [fn]
     * dynamicClass: [fn]
     */
    var TNode = /** @class */ (function () {
        function TNode(tagName, attributes) {
            this.directives = [];
            this.components = [];
            this.dynamicAttributesFn = Array.from(new Array(3), function () { return new Array(); });
            this.tagName = tagName;
            this.attributes = attributes;
        }
        TNode.prototype.addDynamicAttrubute = function (type, key, fn) {
            if (type == AttributeType.dynamicAttrubute) {
                this.dynamicAttributesFn[type].push({ key: key, fn: fn });
            }
            else {
                this.dynamicAttributesFn[type].push(fn);
            }
        };
        return TNode;
    }());

    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var offset = 20;
    var TemplateView = /** @class */ (function (_super) {
        __extends(TemplateView, _super);
        function TemplateView() {
            var _this = _super.call(this) || this;
            _this[_a] = null;
            _this[_b] = new Array();
            _this[_c] = null;
            _this[_d] = new Array();
            _this[_e] = new Array();
            _this[_f] = new Array();
            _this[_g] = {};
            _this[_h] = new Array();
            _this[_j] = new Array();
            _this[_k] = new Array();
            _this[_l] = new Array();
            _this[_m] = null;
            _this.$getDefinition = (function () {
                var def;
                return function () {
                    if (!def) {
                        def = _this[TViewIndex.Compiler].transform(_this[TViewIndex.Class]);
                    }
                    return def;
                };
            })();
            Object['setPrototypeOf'](_this, TemplateView.prototype);
            return _this;
        }
        // 初始阶段，将view添加到 检测树
        TemplateView.prototype.attach = function () {
            var e_1, _o, _p;
            Instruction.pushContext(this);
            var def = this.$getDefinition();
            def.template(1, this[TViewIndex.Context]);
            var children = this[TViewIndex.ComponentDef];
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var child = children_1_1.value;
                    var tView = this[child + offset];
                    tView.attach();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_o = children_1.return)) _o.call(children_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            (_p = this[TViewIndex.Host]).append.apply(_p, __spreadArray([], __read(this[TViewIndex.RootElements]), false));
            Instruction.popContext();
        };
        // 变更检测
        TemplateView.prototype.detectChanges = function () {
            var e_2, _o;
            Instruction.pushContext(this);
            var def = this.$getDefinition();
            def && def.template(2, this[TViewIndex.Context]);
            try {
                for (var _p = __values(this[TViewIndex.ComponentDef]), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var child = _q.value;
                    var tView = this[child + offset];
                    tView.detectChanges();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_o = _p.return)) _o.call(_p);
                }
                finally { if (e_2) throw e_2.error; }
            }
            Instruction.popContext();
        };
        // 检测子视图
        TemplateView.prototype.checkChildren = function () {
            var e_3, _o;
            try {
                for (var _p = __values(this[TViewIndex.ComponentDef]), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var child = _q.value;
                    var tView = this[child + offset];
                    Instruction.pushContext(tView);
                    tView.detectChanges();
                    Instruction.popContext();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_o = _p.return)) _o.call(_p);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        return TemplateView;
    }(Array));
    _a = TViewIndex.Host, _b = TViewIndex.RootElements, _c = TViewIndex.Class, _d = TViewIndex.LView, _e = TViewIndex.Parent, _f = TViewIndex.Children, _g = TViewIndex.Context, _h = TViewIndex.Directives, _j = TViewIndex.ComponentDef, _k = TViewIndex.Attributes, _l = TViewIndex.Slots, _m = TViewIndex.Compiler;
    /** @class */ ((function (_super) {
        __extends(LogicView, _super);
        function LogicView() {
            return _super.call(this) || this;
        }
        return LogicView;
    })(Array));

    // 根据元素的属性，将静态，动态属性分离，生成create，update指令集，指向对应属性
    var factory = /** @class */ (function () {
        function factory(htmlTokens, selector) {
            this.elementIndex = 0;
            this.stacticAttrubutes = [];
            this.dynamicAttrubutes = [];
            this.dynamicStyle = [];
            this.dynamicClass = [];
            this.events = [];
            this.params = new Set();
            this.Attributes = new Array();
            this.createFn = "componentType.InstructionIFrameStates = cacheInstructionIFrameStates(componentType, attributes, ctx)\n";
            this.updateFn = "";
            this.elements = new Array();
            this.origin = htmlTokens;
            this.selector = selector;
        }
        Object.defineProperty(factory.prototype, "$def", {
            get: function () {
                if (!this.componentDef) {
                    this.createFactory();
                }
                return this.componentDef;
            },
            enumerable: false,
            configurable: true
        });
        factory.prototype.createFactory = function () {
            var e_1, _a;
            var root = this.origin.root;
            try {
                for (var root_1 = __values(root), root_1_1 = root_1.next(); !root_1_1.done; root_1_1 = root_1.next()) {
                    var element = root_1_1.value;
                    var type = element.type;
                    switch (type) {
                        case 1:
                            this.createElement(element);
                            break;
                        case 3:
                            this.resolveText(element);
                            break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (root_1_1 && !root_1_1.done && (_a = root_1.return)) _a.call(root_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.createTemplateFn();
            this.createComponent();
        };
        factory.prototype.createElement = function (elementNode) {
            var _this = this;
            this.params.add('elementStart');
            var tagName = elementNode.tagName, attributes = elementNode.attributes; elementNode.close; var children = elementNode.children;
            var elementFn = "elementStart('".concat(tagName, "',").concat(this.elementIndex);
            this.createFn += elementFn + ');\n';
            this.handleAttributes(attributes);
            this.elementIndex++;
            // 子节点
            children.forEach(function (child) {
                var type = child.type;
                switch (type) {
                    case 1:
                        _this.createElement(child);
                        break;
                    case 3:
                        _this.resolveText(child);
                        break;
                }
            });
            this.closeElement(elementNode);
        };
        factory.prototype.handleText = function () { };
        factory.prototype.handleAttributes = function (attrArray) {
            var hasDynamicAtribute = false;
            // 初始化属性列
            this.dynamicStyle[this.elementIndex] = new Array();
            this.dynamicClass[this.elementIndex] = new Array();
            this.stacticAttrubutes[this.elementIndex] = new Array();
            this.dynamicAttrubutes[this.elementIndex] = new Array();
            this.events[this.elementIndex] = new Array();
            for (var i = 0; i < attrArray.length;) {
                if (attrArray[i + 1] == '=') {
                    var pre = attrArray[i][0];
                    switch (pre) {
                        case '@':
                            this.addListener(attrArray[i], attrArray[i + 2]);
                            break;
                        case '&':
                            hasDynamicAtribute = true;
                            this.addDynamicAttrubute(attrArray[i], attrArray[i + 2]);
                            break;
                        default:
                            this.addStaticAttrubute(attrArray[i], attrArray[i + 2]);
                            break;
                    }
                    i += 3;
                }
                else {
                    this.addStaticAttrubute(attrArray[i], '');
                    i++;
                }
            }
            if (this.dynamicStyle[this.elementIndex].length > 0 &&
                this.dynamicClass[this.elementIndex].length > 0 &&
                this.dynamicAttrubutes[this.elementIndex].length > 0) {
                this.createFn += "property(".concat(this.elementIndex, ")");
            }
            this.createAttribute(this.elementIndex);
            if (hasDynamicAtribute) {
                this.updateProperty();
            }
        };
        factory.prototype.closeElement = function (elementNode) {
            this.params.add('elementEnd');
            var tagName = elementNode.tagName;
            this.createFn += "elementEnd('".concat(tagName, "');\n");
        };
        factory.prototype.setStaticAttribute = function () { };
        factory.prototype.setDynamicAttribute = function () { };
        // resolveText(element){
        //     let {source, }
        // }
        // 解析 文本
        factory.prototype.resolveText = function (text) {
            var content = text.content, _a = text.bindings, bindings = _a === void 0 ? [] : _a, _b = text.tokens, tokens = _b === void 0 ? [] : _b;
            this.Attributes[this.elementIndex] = [content, bindings, tokens];
            if (bindings.length > 0) {
                this.createText(content);
                this.updateText(tokens);
            }
            else {
                this.createText(content);
            }
            this.elementIndex++;
        };
        // 创建文本
        factory.prototype.createText = function (expression) {
            this.params.add('creatText');
            var fn = "creatText(".concat(this.elementIndex, ",'").concat(expression, "');\n");
            this.createFn += fn;
        };
        // 更新文本
        factory.prototype.updateText = function (tokens) {
            this.params.add('updateText');
            var fn = "updateText(".concat(this.elementIndex, ",").concat(tokens.join(','), ")");
            this.updateFn += fn;
        };
        factory.prototype.addStaticAttrubute = function (key, value) {
            var attribute = this.stacticAttrubutes[this.elementIndex];
            attribute.push(key, value);
        };
        factory.prototype.addDynamicAttrubute = function (key, value) {
            var styles = this.dynamicStyle[this.elementIndex], classes = this.dynamicStyle[this.elementIndex], dynamicAttrubutes = this.dynamicAttrubutes[this.elementIndex], keyName = key.substring(1), propertyType;
            if (keyName == 'style') {
                styles.push(value);
                propertyType = AttributeType.dynamicStyle;
            }
            else if (keyName == 'class') {
                classes.push(value);
                propertyType = AttributeType.dynamicClass;
            }
            else {
                dynamicAttrubutes.push(keyName, value);
                propertyType = AttributeType.dynamicAttrubute;
            }
            this.addProperty(keyName, value, propertyType);
        };
        factory.prototype.addProperty = function (key, value, propertyType) {
            this.params.add('propertyFn');
            this.params.add('updateProperty');
            var start = value.startsWith('{') ? '(' : '', end = value.startsWith('{') ? ')' : '';
            // 根据表达式，直接生成目的值
            var target = "(context)=>{\n            with(context){\n                return eval('".concat(start, "' + '").concat(value, "' + '").concat(end, "')\n            }\n        }");
            this.createFn += "propertyFn(".concat(this.elementIndex, ",").concat(propertyType, ",'").concat(key, "',").concat(target, ")\n");
        };
        factory.prototype.updateProperty = function () {
            this.updateFn += "updateProperty(".concat(this.elementIndex, ")\n");
        };
        // 为节点添加事件【解析对应的函数】
        factory.prototype.addListener = function (eventName, callback) {
            this.params.add('listener');
            var events = this.events[this.elementIndex];
            events.push(eventName, callback);
            var _a = __read(callback.replace(/[()]/g, ' ').split(' '), 2), fn = _a[0], params = _a[1];
            eventName = eventName.substring(1);
            var eventFn = "listener('".concat(eventName, "',function($event){\n            return ctx['").concat(fn, "'](").concat(params, ");\n        },").concat(this.elementIndex, ");\n");
            this.createFn += eventFn;
        };
        // 根据创建函数，更新函数，组合成template函数;
        factory.prototype.createTemplateFn = function () {
            this.template = new Function('mode', 'ctx', "\n                if(mode & 1){\n                    ".concat(this.createFn, "\n\n                };\n                if(mode & 2){\n                    ").concat(this.updateFn, "\n\n                };\n            "));
        };
        factory.prototype.createAttribute = function (index) {
            var _a, _b, _c, _d, _e;
            this.Attributes[index] = [];
            if (this.stacticAttrubutes[index].length > 0) {
                (_a = this.Attributes[index]).push.apply(_a, __spreadArray([AttributeType.staticAttribute], __read(this.stacticAttrubutes[index]), false));
            }
            if (this.dynamicStyle[index].length > 0) {
                (_b = this.Attributes[index]).push.apply(_b, __spreadArray([AttributeType.dynamicStyle,
                    'style'], __read(this.dynamicStyle[index]), false));
            }
            if (this.dynamicClass[index].length > 0) {
                (_c = this.Attributes[index]).push.apply(_c, __spreadArray([AttributeType.dynamicClass,
                    'class'], __read(this.dynamicClass[index]), false));
            }
            if (this.dynamicAttrubutes[index].length > 0) {
                (_d = this.Attributes[index]).push.apply(_d, __spreadArray([AttributeType.dynamicAttrubute], __read(this.dynamicAttrubutes[index]), false));
            }
            if (this.events[index].length > 0) {
                (_e = this.Attributes[index]).push.apply(_e, __spreadArray([AttributeType.event], __read(this.events[index]), false));
            }
        };
        factory.prototype.createComponent = function () {
            var componentDef = (this.componentDef = new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], __read(Array.from(this.params)), false), ['cacheInstructionIFrameStates',
                'componentType', "\n            let selector = '".concat(this.selector, "',\n                attributes = ").concat(JSON.stringify(this.Attributes), ";\n            return {\n                selector,\n                attributes,\n                template:").concat(this.template, "\n            }\n        ")], false)))());
            console.log(componentDef);
        };
        return factory;
    }());
    var compiler = /** @class */ (function () {
        function compiler(parse, instructionFns, factory) {
            this.parse = parse;
            this.instructionFns = instructionFns;
            this.factory = factory;
        }
        compiler.prototype.transform = function (component) {
            var e_2, _a;
            var selector = component.selector, template = component.template;
            var htmlTokens = new this.parse(template);
            var componentFactory = new factory(htmlTokens, selector);
            componentFactory.createFactory();
            var paramsOfInstructionKey = Array.from(componentFactory.params).concat('cacheInstructionIFrameStates'), paramsOfInstruction = [];
            try {
                for (var paramsOfInstructionKey_1 = __values(paramsOfInstructionKey), paramsOfInstructionKey_1_1 = paramsOfInstructionKey_1.next(); !paramsOfInstructionKey_1_1.done; paramsOfInstructionKey_1_1 = paramsOfInstructionKey_1.next()) {
                    var key = paramsOfInstructionKey_1_1.value;
                    paramsOfInstruction.push(this.instructionFns[key]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (paramsOfInstructionKey_1_1 && !paramsOfInstructionKey_1_1.done && (_a = paramsOfInstructionKey_1.return)) _a.call(paramsOfInstructionKey_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // 运行构造函数【生成组件的指令集函数】
            var componentDef = componentFactory.componentDef.apply(componentFactory, __spreadArray(__spreadArray([], __read(paramsOfInstruction), false), [component], false));
            console.log(componentDef);
            return componentDef;
        };
        return compiler;
    }());
    var factoryToken = new InjectionToken('编译转换函数,将html转换为指令集'), compilerToken = new InjectionToken('组合指令集,收集[parse,factory,Instruction] 生成 compiler函数');

    /**
     *  TView 存储虚拟节点:[TNode]
     *  LView 存储真实DOM:[DOM]
     */
    /**
     * 全局上下文，【指令状态，rootLView，rootTView】
     */
    var rootTView = new TemplateView();
    rootTView[TViewIndex.Host] = document.createElement('app-block');
    rootTView[TViewIndex.ComponentDef] = [0];
    var elementStack = new Array();
    var instructionIFrameStates = (window['instructionIFrameStates'] = {
        currentTView: rootTView,
        RootElements: new Array(),
        attributes: new Array(),
    });
    // 将组件挂载到当前视图上
    function loadComponent(tView) {
        tView.attach();
    }
    function pushContext(tView) {
        setCurrentTView(tView);
    }
    function popContext() {
        var currentTView = getCurrentTView(), preTView = currentTView[TViewIndex.Parent][0];
        setCurrentTView(preTView);
        instructionIFrameStates.RootElements = preTView[TViewIndex.RootElements];
        console.log(instructionIFrameStates.currentTView);
    }
    function bootstrap(component) {
        var currentTView = getCurrentTView(), root = currentTView[TViewIndex.Host];
        var child = createTView(component, root);
        // 起始view挂载到 虚拟根View
        currentTView[offset] = child;
        loadComponent(child);
        document.body.append(instructionIFrameStates.currentTView[TViewIndex.Host]);
        child.detectChanges();
    }
    // 与指令集上下文与class建立联系
    function cacheInstructionIFrameStates(componentType, attributes) {
        var currentTView = getCurrentTView(); currentTView[TViewIndex.LView];
        // let def = componentType.$getDefinition();
        currentTView[TViewIndex.Attributes] = attributes;
        return instructionIFrameStates;
    }
    function elementStart(tagName, index) {
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView];
        var element = document.createElement(tagName);
        currentLView[index + offset] = element;
        resolvetNode(tagName, index);
        directivesHook(index, 'init');
        linkParentChild(element);
        directivesHook(index, 'insert');
    }
    function resolvetDirective(index) {
        var e_1, _a;
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], 
        // 从TView上继承
        provideDirectives = currentTView[TViewIndex.Declarations];
        var nativeDOM = currentLView[index + offset], TNode = currentTView[index + offset];
        var tagName = TNode.tagName, directives = TNode.directives; TNode.components;
        try {
            for (var provideDirectives_1 = __values(provideDirectives), provideDirectives_1_1 = provideDirectives_1.next(); !provideDirectives_1_1.done; provideDirectives_1_1 = provideDirectives_1.next()) {
                var directive = provideDirectives_1_1.value;
                var selector = directive.selector;
                var _b = __read(resolveSelector(selector), 2), key = _b[0], value = _b[1];
                if (key == tagName && value == null) {
                    // components.push({
                    //     directive,
                    //     context: new directive(),
                    // });
                    currentTView[TViewIndex.ComponentDef].push(index);
                    // 将原来的dom，更改为TView，以标明节点为组件
                    currentTView[index + offset] = createTView(directive, nativeDOM);
                }
                else if (nativeDOM.getAttribute(key) == value) {
                    directives.push(new directive());
                    currentTView[TViewIndex.Directives].push(index);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (provideDirectives_1_1 && !provideDirectives_1_1.done && (_a = provideDirectives_1.return)) _a.call(provideDirectives_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function createTView(component, host) {
        var currentTView = getCurrentTView(), tView = new TemplateView();
        tView[TViewIndex.Host] = host;
        tView[TViewIndex.Class] = component;
        tView[TViewIndex.Context] = new component();
        tView[TViewIndex.Parent] = [currentTView];
        tView[TViewIndex.Compiler] = currentTView[TViewIndex.Compiler];
        // 继承组件/指令/管道
        tView[TViewIndex.Declarations] = currentTView[TViewIndex.Declarations];
        return tView;
    }
    function linkParentChild(el, index) {
        var RootElements = instructionIFrameStates.RootElements;
        var nodeType = el.nodeType;
        if (elementStack.length > 0) {
            parent = elementStack[elementStack.length - 1];
            BrowserRenderFns.appendChild(parent, el);
        }
        else {
            if (nodeType == elementType.Text) {
                RootElements.push(el);
            }
        }
        if (nodeType == elementType.Element) {
            elementStack.push(el);
        }
    }
    function directivesHook(index, lifecycle) {
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], directives = currentTView[index + offset].directives;
        var dom = currentLView[index + offset], parent = dom.parent;
        directives &&
            directives.forEach(function (directive) {
                if (typeof directive[lifecycle] == 'function') {
                    directive[lifecycle](parent, dom);
                }
            });
    }
    function listener(eventName, callback, index) {
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView];
        var el = currentLView[index + offset];
        el.addEventListener(eventName, callback);
    }
    function elementEnd(tagName) {
        var RootElements = instructionIFrameStates.RootElements;
        var elementStart = elementStack.pop();
        if (elementStart.localName == tagName) {
            if (elementStack.length == 0) {
                RootElements.push(elementStart);
            }
        }
    }
    function creatText(index) {
        var content = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            content[_i - 1] = arguments[_i];
        }
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView];
        var text = document.createTextNode(content);
        currentLView[index + offset] = text;
        currentTView[index + offset] = __spreadArray([
            null
        ], __read(currentTView[TViewIndex.Attributes][index]), false);
        // 解析 text，确定text的属性
        // resolveText()
        linkParentChild(text);
    }
    function updateText(index) {
        var content = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            content[_i - 1] = arguments[_i];
        }
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView];
        var element = currentLView[index + offset];
        var newContent = content.join('');
        if (element.textContent !== newContent) {
            element.textContent = newContent;
        }
    }
    function propertyFn(index, type, key, fn) {
        var currentTView = getCurrentTView();
        var TNode = currentTView[index + offset];
        TNode.addDynamicAttrubute(type, key, fn);
    }
    function updateProperty(index) {
        directivesHook(index, 'beforePropertyUpdate');
        var TNode = getTNode(index);
        var dynamicAttributesFn = TNode.dynamicAttributesFn;
        var _a = __read(dynamicAttributesFn, 3), attributes = _a[0], stylesFn = _a[1], classFn = _a[2];
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
    function getTNode(index) {
        var currentTView = getCurrentTView();
        return currentTView[index + offset];
    }
    function updateStyle(index, fns) {
        var e_2, _a;
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], nativeDOM = currentLView[index + offset], styleMap = nativeDOM.attributeStyleMap, context = currentTView[TViewIndex.Context], obj = {};
        fns.forEach(function (fn) {
            Object.assign(obj, fn(context));
        });
        try {
            for (var _b = __values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                styleMap.set(key, obj[key]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function updateClass(index, fns) {
        var e_3, _a;
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], context = currentTView[TViewIndex.Context], nativeDOM = currentLView[index + offset];
        var classString = nativeDOM.getAttribute('class') || '', classObj = {}, resultFn = {}, classMerge = '';
        classString &&
            classString.split(' ').map(function (key) {
                if (key.trim() !== '') {
                    classObj[key] = true;
                }
            });
        fns.forEach(function (fn) {
            Object.assign(resultFn, fn(context));
        });
        classObj = Object.assign(classObj, resultFn);
        try {
            for (var _b = __values(Object.keys(classObj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (classObj[key]) {
                    classMerge += "".concat(key, " ");
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        nativeDOM.setAttribute('class', classMerge);
    }
    function updateProp(index, attributes) {
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], nativeDOM = currentLView[index + offset], context = currentTView[TViewIndex.Context];
        attributes.forEach(function (attributeObj) {
            var key = attributeObj.key, fn = attributeObj.fn;
            nativeDOM.setAttribute(key, fn(context));
        });
    }
    /**
     *
     * @param tagName string
     * @param index number
     */
    function resolvetNode(tagName, index) {
        var e_4, _a;
        var currentTView = getCurrentTView(), currentLView = currentTView[TViewIndex.LView], nativeDOM = currentLView[index + offset], attributes = currentTView[TViewIndex.Attributes][index] || [];
        var attributesMap = {
            staticAttribute: new Map(),
            dynamicAttrubute: new Map(),
            style: new Map(),
            dynamicStyle: new Map(),
            class: new Map(),
            dynamicClass: new Map(),
            event: new Map(),
        };
        var current;
        for (var i = 0; i < attributes.length;) {
            if (AttributeType[attributes[i]] !== undefined) {
                current = attributesMap[String(AttributeType[attributes[i]])];
                i++;
            }
            current === null || current === void 0 ? void 0 : current.set(attributes[i], attributes[i + 1]);
            i += 2;
        }
        try {
            // 静态数据
            for (var _b = __values(attributesMap['staticAttribute'].keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                nativeDOM.setAttribute(key, attributesMap['staticAttribute'].get(key));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // 事件
        currentTView[index + offset] = new TNode(tagName, attributesMap);
        resolvetDirective(index);
    }
    function getCurrentTView() {
        var TView = instructionIFrameStates.currentTView;
        if (!TView) {
            TView = new TemplateView();
            setCurrentTView(TView);
        }
        return TView;
    }
    function setCurrentTView(TView) {
        instructionIFrameStates.currentTView = TView;
        instructionIFrameStates.RootElements = TView[TViewIndex.RootElements];
    }
    // 虚拟一个模块的 TView
    function moduleInitTView(injector, declarations, host) {
        if (declarations === void 0) { declarations = []; }
        if (host === void 0) { host = document.createElement('div'); }
        var compiler = injector.get(compilerToken);
        rootTView = new TemplateView();
        rootTView[TViewIndex.Host] = host;
        rootTView[TViewIndex.Declarations] = declarations;
        rootTView[TViewIndex.Injector] = injector;
        rootTView[TViewIndex.Compiler] = compiler;
        instructionIFrameStates.currentTView = rootTView;
        return rootTView;
    }
    var Instruction = {
        loadComponent: loadComponent,
        pushContext: pushContext,
        popContext: popContext,
        bootstrap: bootstrap,
        cacheInstructionIFrameStates: cacheInstructionIFrameStates,
        elementStart: elementStart,
        resolvetDirective: resolvetDirective,
        createTView: createTView,
        linkParentChild: linkParentChild,
        directivesHook: directivesHook,
        listener: listener,
        elementEnd: elementEnd,
        creatText: creatText,
        updateText: updateText,
        propertyFn: propertyFn,
        updateProperty: updateProperty,
        getTNode: getTNode,
        updateStyle: updateStyle,
        updateClass: updateClass,
        updateProp: updateProp,
        resolvetNode: resolvetNode,
        getCurrentTView: getCurrentTView,
        setCurrentTView: setCurrentTView,
        moduleInitTView: moduleInitTView,
    };
    var InstructionToken = new InjectionToken('处理View的指令集。');

    var PlatformRef = /** @class */ (function () {
        function PlatformRef(injector) {
            this.registeredModules = new Map();
            this.rootModules = new Map();
            this.injector = injector;
        }
        PlatformRef.prototype.bootstrapModule = function (module) {
            var $bootstrap = module.$bootstrap;
            this.resolveModule(module);
            var moduleRef = new module();
            this.rootModules.set(module, moduleRef);
            if ($bootstrap.length > 0) {
                this.bootstrapComponent($bootstrap[0]);
            }
        };
        PlatformRef.prototype.bootstrapComponent = function (rootComponent) {
            Instruction.bootstrap(rootComponent);
        };
        PlatformRef.prototype.resolveModule = function (module) {
            // 解析模块及 imports的模块，将组件/指令/管道  组合到一起，建立虚拟的 TView【module】，
            // 虚拟的 TView【module】，作为组件的顶级TView，以提供通用数据【组件，指令，render...】
            var $declarations = module.$declarations, $imports = module.$imports; module.$exports; var $providers = module.$providers; module.$bootstrap;
            var externalDeclarations = this.getExternalDeclarations($imports);
            var allDeclarations = $declarations.concat(externalDeclarations);
            var module_Injector = Injector.create($providers);
            Instruction.moduleInitTView(module_Injector, allDeclarations);
        };
        PlatformRef.prototype.getExternalDeclarations = function (importModules) {
            var e_1, _a;
            var exportDeclarations = new Array();
            try {
                for (var importModules_1 = __values(importModules), importModules_1_1 = importModules_1.next(); !importModules_1_1.done; importModules_1_1 = importModules_1.next()) {
                    var module_1 = importModules_1_1.value;
                    var $imports = module_1.$imports, $exports = module_1.$exports;
                    exportDeclarations = exportDeclarations.concat($exports, this.getExternalDeclarations($imports));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (importModules_1_1 && !importModules_1_1.done && (_a = importModules_1.return)) _a.call(importModules_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return exportDeclarations;
        };
        return PlatformRef;
    }());
    function collectRunDependency(parentPlatformProviders, name, providers) {
        var allProviders = parentPlatformProviders.concat(providers);
        return function (extraProvides) {
            if (extraProvides === void 0) { extraProvides = []; }
            return allProviders.concat(extraProvides);
        };
    }
    function createPlatform(injector) {
        return injector.get(PlatformRef);
    }

    var CORE_PROVIDES = [
        { provide: PlatformRef, deps: [Injector], useClass: PlatformRef },
        { provide: Injector, deps: [], useClass: Injector },
        {
            provide: InstructionToken,
            useValue: Instruction,
        },
        {
            provide: compilerToken,
            deps: [Parse, , InstructionToken, factoryToken],
            useClass: compiler,
        },
        {
            provide: factoryToken,
            useValue: factory,
        },
    ];
    var PlatformCore = CORE_PROVIDES;

    var Browser_Providers = [
        {
            provide: Parse,
            useValue: ParseTemplate,
        },
        {
            provide: Render,
            useValue: BrowserRenderFns,
        },
    ];
    function PlatformBrowserDynamic(extraProvides) {
        if (extraProvides === void 0) { extraProvides = []; }
        var platFormProviders = collectRunDependency(PlatformCore, 'browser', Browser_Providers);
        var platFomrInjector = Injector.create(platFormProviders(extraProvides));
        var platformRef = createPlatform(platFomrInjector);
        window['platformRef'] = platformRef;
        console.log(platformRef);
        return platformRef;
    }

    var firstDirective = /** @class */ (function () {
        function firstDirective() {
            this.name = '第一个指令';
        }
        firstDirective.prototype.init = function () {
            console.log('init');
        };
        firstDirective.prototype.insert = function (parent, current) {
            console.log('insert', parent, current);
        };
        firstDirective.prototype.beforePropertyUpdate = function () {
            console.log('beforePropertyUpdate');
        };
        firstDirective.prototype.afterPropertyUpdate = function () {
            console.log('afterPropertyUpdate');
        };
        firstDirective.prototype.afterHostUpdate = function () {
            console.log('afterHostUpdate');
        };
        firstDirective.selector = '[data-angular]';
        return firstDirective;
    }());
    var ChilComponent = /** @class */ (function () {
        function ChilComponent() {
        }
        ChilComponent = __decorate([
            Component({
                selector: "app-child",
                template: "app-child\u7EC4\u4EF6",
                styles: '',
            })
        ], ChilComponent);
        return ChilComponent;
    }());
    var MyComponent = /** @class */ (function () {
        function MyComponent() {
            this.exp = '第一个插值';
            this.exp2 = '第2个插值';
            this.block = 'com';
            this.dataWidth = '200px';
            this.class1 = true;
            this.class2 = false;
        }
        MyComponent.prototype.emit = function (e, value) {
            console.log(e, value, this);
        };
        MyComponent = __decorate([
            Component({
                selector: "#root",
                styles: "",
                template: "<div\n            data-angular\n            name=\"angular\"\n            &style=\"{width: dataWidth}\"\n            @change=\"go($event,'query')\"\n        >\n            \u5B50\u5143\u7D20:\u3010\u6587\u672C\u3011\n            <div\n                style=\"width: 100px;height: 100px;background-color:#e5e0e1;\"\n                &style=\"{width: dataWidth}\"\n                &name=\"block\"\n                @click=\"emit($event,123)\"\n            ></div>\n        </div>\n        <p\n            class=\"forP bindClass2\"\n            &class=\"{bindClass1: class1,bindClass2: class2}\"\n        >\n            \u6211\u662F:{{ exp }},{{ exp2 }}\n        </p>\n        <app-child></app-child>\n        <!-- \u6CE8\u91CA\u4FE1\u606F-->",
            })
        ], MyComponent);
        return MyComponent;
    }());
    var AppModule = /** @class */ (function () {
        function AppModule() {
        }
        AppModule = __decorate([
            Module({
                declarations: [MyComponent, ChilComponent, firstDirective],
                imports: [],
                exports: [],
                providers: [],
                bootstrap: [MyComponent],
            })
        ], AppModule);
        return AppModule;
    }());
    var platformRef = PlatformBrowserDynamic();
    console.log(platformRef);
    platformRef.bootstrapModule(AppModule);

})));
