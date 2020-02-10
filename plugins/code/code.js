/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

// google code prettify: http://google-code-prettify.googlecode.com/
// http://google-code-prettify.googlecode.com/

KindEditor.plugin('code', function (K) {
    var self = this, 
        name = 'code', 
        title = self.lang(name), 
        lang = self.lang(name + '.'), 
        codes = {
            js: 'JavaScript',
            html: 'HTML',
            css: 'CSS',
            php: 'PHP',
            perl: 'Perl',
            python: 'Python',
            ruby: 'Ruby',
            java: 'Java',
            vb: 'ASP/VB',
            cpp: 'C/C++',
            cs: 'C#',
            xml: 'XML',
            bsh: 'Shell',
            code: 'Other'
        }, 
		html = '<div style="padding:10px 20px;"><div class="ke-dialog-row"><select class="ke-code-type">',
		hackIe = K.IE && K.V < 9,
        contextBlock;
    for (var key in codes) {
        html += '<option value="' + key + '">' + codes[key] + '</option>';
    }
    html += '</select></div><textarea class="ke-textarea ke-textarea-code" style="width:100%;height:540px;"></textarea></div>';
    function openDialog(elm) {
        var dialog = self.createDialog({
                name: name,
                width: 800,
                title: title,
                body: html,
                yesBtn: {
                    name: self.lang('yes'),
                    click: function (e) {
						var type = K('.ke-code-type', dialog.div).val(), 
							code = textarea.val(), 
							cls = 'prettyprint' + (type === '' ? '' : ' lang-' + type);
                        if (K.trim(code) === '') {
                            alert(lang.pleaseInput);
                            textarea[0].focus();
                            return;
						}
						code = K.escape(code);
                        if (elm) {
                            elm[0].className = cls;
                            elm.html(hackIe ? '<span class="prettyprint_ie">'+ code+'</span>' : code);
                        } else {
                            self.insertHtml('<pre class="' + cls + '" contenteditable="false">\n' + code + '</pre> ');
                        }
                        self.hideDialog().focus();
                    }
                }
            }), textarea = K('textarea', dialog.div);
        if (elm) {
            textarea.val(elm.text());
        }
        textarea[0].focus();
    }
    function isCodePre(e) {
        var elm = K(e.target);
        return elm.name === 'pre' && elm.hasClass('prettyprint') ? elm : null;
    }
    function isCond(e) {
        contextBlock = isCodePre(e);
        return !!contextBlock;
    }
    function init() {
        var doc = K.iframeDoc(self.edit.iframe);
        K(doc).dblclick(function (e) {
            var elm = isCodePre(e);
            if (!elm) {
                return;
            }
            e.preventDefault();
            openDialog(elm);
        });
    }
    self.clickToolbar(name, function () {
        openDialog();
    });
    self.addContextmenu({
        title: lang.edit,
        cond: isCond,
        width: 150,
        iconClass: 'ke-icon-code',
        click: function () {
            openDialog(contextBlock);
            self.hideMenu();
        }
    }).addContextmenu({
        title: lang.remove,
        cond: isCond,
        width: 150,
        click: function () {
            self.hideMenu();
            contextBlock.remove();
            self.addBookmark();
            contextBlock = null;
        }
	});
	if (hackIe) {
		self.beforeGetHtml(function(html) {
			return html.replace(/<span[^>]*class="?prettyprint_ie"?[^>]*>([\s\S]*?)<\/span>/ig, function(full, code) {
				return code;
			})
		});
	} else if (!K.IE) {
        if (self.isCreated) {
            init();
        } else {
            self.afterCreate(init);
        }
    }
});