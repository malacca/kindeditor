## What is KindEditor?

KindEditor is a lightweight, Open Source(LGPL), cross browser, web based WYSIWYG HTML editor. KindEditor has the ability to convert standard textareas to rich text editing.

## Official site

http://kindeditor.org/

## Contributors

* Timon Lin
* daif alotaibi (http://daif.net/) : Arabic Translation
* fisker (https://github.com/fisker) : QQ style theme
* composite (https://github.com/composite) : Korean Translation

-------------------------------------------------------------------------
## 在线预览

[[GitHub Pages]](https://malacca.github.io/kindeditor/)  -  [[Gitee Pages]](http://malaccas.gitee.io/kindeditor)

## 功能修改

`plugins.insertfile`

合并 flash / media / image 这三个插件进去，这4个插件代码本来就基本相同。


`plugins.table`

点击工具栏改为快速创建 Table, 而不再是弹出层。


`plugins.emoticons`

插入表情修改为多 Tab 支持，方便后期再扩展，想增加一个结合斗图API的插入表情包功能


`plugins.baidumap`

动态地图以 `iframe` 形式插入，默认使用 `plugins/baidumap/index.html`，
考虑到 js 可能会部署到不支持 html 的 cdn 服务器，所以新增一个 `mapHtml` 参数，
用来自定义 html 的 Url，只需复制 html 到对应的 Url 即可。

另外： baidumap 还支持 `mapWidth` 和 `mapHeight` 两个参数来设置地图尺寸。


`plugins.multiimage`

不再打包的核心js中，仍可用，但不建议使用，毕竟 flash 已要淘汰，且有了插入单张图片插件。


## 参数变更

相对于 http://kindeditor.net/docs/option.html （[备用文档](docs/option.rst)）

**新增**

`mapHtml`

新增参数，参考 `plugins.baidumap` 说明

`pluginAlias`

动态加载插件以 plugin name 作为文件名加载的，参考上面的 `plugins.insertfile`，若一个文件实现了若干个插件，显然这样就不行了，添加该配置，可进行指定。如
```js
pluginAlias:{
    insertfile:['image', 'flash', 'media'],
}
```

`fullscreenStatusBar`

全屏时是否显示底部的 statusBar，默认为不显示


`loadStyleMode`

是否自动加载 theme css, 默认自动加载 `themesPath` 下的 `themeType`，这样仅引入 js 即可；若已手动引入 css,可将该参数设置为 false (该参数原本就有的，官方文档未作说明)

`cssEmpty`

编辑区的样式，默认会注入缺省样式；可通过设置 `bodyClass` / `cssData` / `cssPath` 来重置默认样式，这里新增一个参数，若设置为 true，这默认不注入样式，完全使用自定义样式。

`forceIframeTransport`

参见文件上传的说明


**修改**

`extraFileUploadParams`

改为 Function, 可更自由的设置上传文件的额外参数，而不是固定的。



**移除**

`imageTabIndex` / `allowImageRemote`

插入图片不再以 Tab 形式显示，所以不再支持该选项。

`autoHeightMode` / `fixToolBar`

移除了相关插件，所以也就不再支持了。



## 文件上传

依然使用 `uploadJson` 设置接口。

返回 `{error:int, url:String, message:String}`  int!=0 表示有错误。

若跨域，上传文件时发送的请求可能携带 GET 参数 `_iframe`

假设编辑器所在页面的域名为 `a.com`， 接口为 `b.com`

若未携带或 `_iframe!=1`，直接输出 json，但要在 response header 设置以下两项

```
Access-Control-Allow-Origin: a.com
Access-Control-Allow-Credentials: true
```

若携带 `_iframe=1` 此时可能为 IE 旧版浏览器或有限支持 XMLRequest 的浏览器

1. 将 [plugins/insertfile/result.html](plugins/insertfile/result.html) 文件放到 `a.com` 网站下

2. 上传成功后 301 跳转到 `a.com/result.html?urlencode(resultJSON)`

若设置 `forceIframeTransport:true` 则总是会携带 `_iframe=1`

## 文件浏览

依然使用 `fileManagerJson` 设置接口。返回 json 格式

```js
{
    //上级目录路径
    moveup_dir_path:String,
    //当前目录路径
    current_dir_path:String,
    //当前目录URL
    current_url:String,
    //文件数
    total_count:Int,
    //文件列表
    file_list:[
        //是否为目录
        is_dir:Bool,
        //文件名
        filename:String,
        //文件大小
        filesize:String,
        //时间字符串
        datetime:String,
    ]
}
```

若跨域，请求可能会携带 GET 参数 `callback=string`

1. 若未携带，直接输出 json 数据即可，但同时也要输出与上传文件相同的 header

2. 若携带，则意味着使用 jsonp 获取数据，输出 `callback(json)`