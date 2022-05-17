// 属性选择器 [name="**"]
// id选择器 "#id"
// class选择器 ".className"
// 节点选择器 "div"
function resolveSelector(selector: string) {
    let kv = [];
    let pre = selector[0];
    if (pre == '#') {
        kv.push('id', selector.substring(1));
    } else if (pre == '.') {
        kv.push('class', selector.substring(1));
    } else if (pre == '[') {
        let [key, value] = selector
            .substring(1, selector.length - 1)
            .split('=');
        // 处理 value "[name=angular]" 和 "[name = 'angular']" 一样
        if (value) {
            kv.push(key.trim(), value.replace(/['"]/g, '').trim());
        } else {
            kv.push(key.trim(), '');
        }
    } else {
        kv.push(selector, null);
    }
    return kv;
}
export { resolveSelector };
