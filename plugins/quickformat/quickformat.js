
KindEditor.plugin('quickformat', function (K) {
    var self = this, 
        name = 'quickformat',
		lang = self.lang(name+'.'),
		IE8 = K.IE && K.V < 9;

    function hasAttr(node, attr) {
        return node.hasAttribute ? node.hasAttribute(attr) : !!node[attr];
    }

    function removeAttrs(node) {
        while(node.attributes.length > 0) {
            node.removeAttribute(node.attributes[0].name)
        }
        return node;
	}
	
    function removeIE8TdAttrs(node) {
        var names = [];
        for (var name,i=0; i<node.attributes.length; i++) {
            name = node.attributes[i].name.toLowerCase();
            if (name === 'rowspan' || name === 'rowspan') {
                continue;
            }
            names.push(name);
        }
        while(name = names.shift()) {
            node.removeAttribute(name);
        }
	}
	
    function eachNodes(nodes, fn) {
        var nodeArr = [], node, i;
        for (i=0; i<nodes.length; i++) {
            nodeArr.push(nodes[i]);
        }
        while(node = nodeArr.shift()) {
            fn.call(node, node);
        }
    }

    function quickformat(indent, imgCenter) {
        var win = self.edit.win,
            doc = self.edit.doc,
            body = doc.body,
            placeHolder = '##___keQuick___##',
            placeLength = placeHolder.length;

        var preNodes = {};
        var replaceNode = function(tag, fn) {
            var nodes = doc.getElementsByTagName(tag),
                len = nodes.length;
            if (!len) {
                return;
            }
            if (!(tag in preNodes)) {
                preNodes[tag] = [];
            }
            var node, parent, str, p;
            node = nodes[0];
            parent = node.parentNode;
            str = fn.call(node, node);
            p = document.createElement("p");
            p.innerHTML =  placeHolder + tag + '_' + preNodes[tag].length;
            parent.insertBefore(p, node);
            parent.removeChild(node);
            preNodes[tag].push(str);
            replaceNode(tag, fn)
        }

        var getReplaceNative = function(txt) {
            if (txt.substr(0, placeLength) === placeHolder) {
                var str = txt.substr(placeLength).split('_'),
                    type = str[0],
                    key = parseInt(str[1]);
                if (preNodes[type] && preNodes[type][key]) {
                    return preNodes[type][key];
                }
            }
        }
        
        var docRange = win.getSelection && typeof doc.createRange != "undefined",
            bodyRange = !docRange && typeof doc.selection != "undefined" && typeof body.createTextRange != "undefined";
        var getPreText = function(elm) {
            if (docRange) {
                elm.setAttribute("contenteditable", true);
                var sel = win.getSelection();
                sel.selectAllChildren(elm);
                var innerText = "" + sel;
                sel.removeAllRanges();
                return innerText;
            }
            if (bodyRange) {
                var range = body.createTextRange();
                range.moveToElementText(elm);
                return range.text;
            } 
            return elm.innerText;
        }

        // 为防止表格嵌套, 或表格内嵌套其他富文本元素, 表格应放到最后提取
        var getClearTable = function(table){
            eachNodes(table.getElementsByTagName('tr'), removeAttrs);
            eachNodes(table.getElementsByTagName('th'), removeAttrs);
            eachNodes(table.getElementsByTagName('td'), function(node) {
                if (IE8) {
                    removeIE8TdAttrs(node);
                } else {
                    removeAttrs(node);
                }
                if (node.getElementsByTagName('table').length) {
                    return;
                }
                var txt = node.innerText.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                if(txt === '') {
                    node.innerHTML = '&nbsp;';
                } else {
                    var re = getReplaceNative(txt);
                    node.innerHTML = re ? re : txt;
                }
            });
            K(removeAttrs(table)).attr({
                style: "width:100%",
                cellpadding:2,
                cellspacing:0,
                border:1
            })
            return table.outerHTML + '<br/>';
        }

        // 提取需要保留的富文本格式
        // img
        replaceNode('img', function(node) {
            if (hasAttr(node, 'data-ke-name')) {
                return '<a name="' + unescape(node.getAttribute('data-ke-name')) + '"></a>'
            } 
            if (hasAttr(node, 'data-ke-tag')) {
                return unescape(node.getAttribute('data-ke-tag'))
            } 
            if (hasAttr(node, 'src') ) {
                return '<p'+(imgCenter ? ' align="center"' : '')+'><img src="'+node.getAttribute('src')+'"/></p>'
            }
            return '';
        });

        // pre
        replaceNode('pre', function(node) {
            if (node.getAttribute("contenteditable")) {
                return node.outerHTML;
            }
            return '<pre>'+getPreText(node)+'</pre>'
        });

        // table
        replaceNode('table', getClearTable);

        // ke-pagebreak
        replaceNode('hr', function(node) {
            return node.className.indexOf('ke-pagebreak') > -1 ? node.outerHTML : '';
        });
        
        // 提取所有纯文本并还原保留标签
        var html = body.innerHTML, newHtml = [];
        K.each(html.replace(/<[^>].*?>/g, "\n").split("\n"), function(k, txt) {
            txt = txt.replace(/^(?:&nbsp;|[\s\uFEFF\xA0])+|(?:&nbsp;|\s+|\uFEFF|\xA0)+$/g, '');
            if (txt === '') {
                return;
            }
            var re = getReplaceNative(txt);
            if (re) {
                newHtml.push(re);
            } else {
                newHtml.push('<p>' + (indent ? '　　' : '') + txt+'</p>')
            }
        });
        return newHtml.join("");
    }

    function quickAction(type) {
        var htm;
        if (type === 'unlink') {
            htm = self.html();
            htm = htm.replace(/<a.*?>(.*)<\/a>/ig,"$1");
        } else {
            var center = type.indexOf('center') > -1,
                indent = type.indexOf('Indent') > -1;
            htm = quickformat(indent, center);
        }
		self.html(htm);
		self.cmd.selection(true);
        self.addBookmark();
    }

	self.clickToolbar(name, function() {
        var menu = self.createMenu({
            name: name,
            width: 180
        });
		K.each(lang, function(i, val) {
			menu.addItem({
				title :  val,
				checked : false,
				click : function() {
                    self.hideMenu();
                    quickAction(i);
				}
			});
        });
        menu.autoLeft();
	});
});