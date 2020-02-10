
function _loadScript(url, fn) {
	var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
		script = document.createElement('script');
	head.appendChild(script);
	script.src = url;
	script.charset = 'utf-8';
	script.onload = script.onreadystatechange = function() {
		if (!this.readyState || this.readyState === 'loaded') {
			if (fn) {
				fn();
			}
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
		}
	};
}

// 移除URL里的GET参数
function _chopQuery(url) {
	var index = url.indexOf('?');
	return index > 0 ? url.substr(0, index) : url;
}

function _loadStyle(url) {
	var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
		link = document.createElement('link'),
		absoluteUrl = _chopQuery(_formatUrl(url, 'absolute'));
	var links = K('link[rel="stylesheet"]', head);
	for (var i = 0, len = links.length; i < len; i++) {
		if (_chopQuery(_formatUrl(links[i].href, 'absolute')) === absoluteUrl) {
			return;
		}
	}
	head.appendChild(link);
	link.href = url;
	link.rel = 'stylesheet';
}

/*
    该函数在核心插件中 仅发现在 filemanager 中用于获取 json
    现代浏览器可通过服务端发送 Access-Control-Allow-(Origin/Credentials) 解决跨域和认证问题
    但对于 IE10 以下不支持, 虽然可通过 XDomainRequest 来支持, 但牵涉到 scheme 一致等多方面问题
    且鉴于 kindeditor 本来是兼容IE7 甚至是 IE6 的, 就把这个特性保持下去
    这里重新实现 ajax 函数, 但仅支持 GET json 数据, IE10 以下使用 jsonp 获取
*/
// function _ajax(url, fn, method, param, dataType) {
// 	method = method || 'GET'; //POST or GET
// 	dataType = dataType || 'json'; //json or html
// 	var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
// 	xhr.open(method, url, true);
// 	xhr.onreadystatechange = function () {
// 		if (xhr.readyState == 4 && xhr.status == 200) {
// 			if (fn) {
// 				var data = _trim(xhr.responseText);
// 				if (dataType == 'json') {
// 					data = _json(data);
// 				}
// 				fn(data);
// 			}
// 		}
// 	};
// 	if (method == 'POST') {
// 		var params = [];
// 		_each(param, function(key, val) {
// 			params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
// 		});
// 		try {
// 			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 		} catch (e) {}
// 		xhr.send(params.join('&'));
// 	} else {
// 		xhr.send(null);
// 	}
// }
function _removeWinVar(x){
    if (!window[x]){
        return;
    }
    try{
        delete window[x];
    }catch(e){
        window[x] = undefined;
    }
}
function _ajax(url, fn) {
    if (K.IE && K.V < 10) {
        var domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
        if(window.location.hostname !== domain) {
            var gfn = 'jsonp' + new Date().getTime();
            window[gfn] = function(json) {
                _removeWinVar(gfn)
                fn && fn(json);
            }
            _loadScript(url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + gfn, function() {
                setTimeout(function() {
                    _removeWinVar(gfn)
                }, 1000);
            });
            return;
        }
    }
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
            fn && fn(_json(xhr.responseText));
        }
    };
    xhr.send(null);
}

K.ajax = _ajax;

K.loadScript = _loadScript;
K.loadStyle = _loadStyle;
