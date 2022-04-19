let parse = require('../dist/main.js');
test(`<div  data-angular name = "Angular">
        不解析插值语法：{{go}},当作普通文本
      </div>
      <!--解析注释-->`, () => {
    let tree = new parse.ParseHTML(
        '<div data-angular name = "Angular">不解析插值语法：{{go}},当作普通文本</div><!--解析注释-->'
    );
    let { root, errors } = tree;
    // errors,错误应为空
    expect(errors.length).toBe(0);
    // 节点配置
    expect(root[0].NodeType).toBe(1);
    expect(root[0].tagName).toBe('div');
    // 节点属性列表
    let attrs = root[0].attrArray;
    expect(attrs[0]).toBe('data-angular');
    expect(attrs[1]).toBe('name');
    expect(attrs[2]).toBe('=');
    expect(attrs[3]).toBe('"Angular"');
    // 子节点
    expect(root[0].children[0].NodeType).toBe(3);
    expect(root[0].children[0].content).toBe(
        '不解析插值语法：{{go}},当作普通文本'
    );
    // 注释值
    expect(root[1].NodeType).toBe(8);
    expect(root[1].content).toBe('解析注释');
});
