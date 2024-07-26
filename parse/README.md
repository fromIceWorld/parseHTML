# 简介
解析html/template，生成token树,记录节点数据;

支持：`元素节点`，`文本节点`，`注释节点`；

实例：

```html
`<div data-angular name="angular"
      &style="{width: dataWidth}"
      @change="go($event,'query')">
	子元素:【文本】
    <div style="width: 100px;height: 100px;background-color:#e5e0e1;" 
         &style="{width: dataWidth}"  
         &name="block" 
         @click="emit($event,123)">
    </div>
</div>
<p class="forP bindClass2"
   &class="{bindClass1: class1,bindClass2: class2}">
    我是:{{exp}},{{exp2}}
</p>
<app-child></app-child>
<!-- 注释信息-->`
```

## 元素节点

```json
{
	tagName: "div"
	type: 1,
    attributes: 
    	['data-angular', 
    	 'name', '=', 'angular', 
         '&style','=', '{width: dataWidth}', 
         '@change', '=', "go($event,'query')"],
	children:[],
	startPosition:{},
	endPosition:{}
}
```

## 文本节点

```json
{
	content: "子元素:【文本】"
	type: 3,
    parent:{},
	startPosition:{},
	endPosition:{}
}
```

## 注释节点

```json
{
	content: "子元素:【文本】"
	type: 8,
	startPosition:{},
	endPosition:{}
}
```

