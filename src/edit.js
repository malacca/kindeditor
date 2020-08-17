
function _iframeDoc(iframe) {
	iframe = _get(iframe);
	return iframe.contentDocument || iframe.contentWindow.document;
}

var html, _direction = '';
if ((html = document.getElementsByTagName('html'))) {
	_direction = html[0].dir;
}

function _getDefaultEditorStyle(full) {
	return `<style>
		html{margin:0;${full ? 'padding:0 15px;background:#F8F8F8' : 'padding:0;'}}
		body{background:#fff;margin:0;padding:20px}
		body.full{margin:15px auto;max-width:800px;padding:30px;box-shadow:0 0 3px 2px rgba(0, 0, 0, 0.08)}
		body,td{font:1em/1.5 "sans serif",tahoma,verdana,helvetica;}
		body, p, div{word-wrap: break-word;}
		noscript {display:none;}
		table{border-collapse:collapse;}
		p{margin-bottom:2em}
		img::selection{background:rgba(0,0,0,.1)}
		img{
			font-size:0;
			border:0;
			vertical-align:bottom;
			max-width:100%;
			*max-width:99.9%;
		}
		img.ke-flash, img.ke-rm, img.ke-media{
			width:100%;
			height:460px;
			background-color:#dedede;
			background-repeat:no-repeat;
			background-position:center;
			background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M447.1 200L295.9 22.1H124.6L275.8 200h171.3zm444.8 0L740.7 22.1H569.4L720.7 200h171.2zm-222.4 0L518.3 22.1H347L498.2 200h171.3zM956.4 22.1H791.8L943.1 200h80.1V88.8c-.1-37.8-29-66.7-66.8-66.7zm-883 0h-6.7C29 22.1 0 51 0 88.8V200h224.6L73.4 22.1zM0 934c0 37.8 28.9 66.7 66.7 66.7h889.7c37.8 0 66.7-28.9 66.7-66.7V244.5H0V934zm355.9-489.3c0-37.8 31.1-55.6 66.7-55.6 11.1 0 24.5 2.2 35.6 8.9l253.5 146.8a63 63 0 0 1 0 111.2L458.2 802.8c-11.1 6.7-22.2 8.9-35.6 8.9-35.6 0-66.7-17.8-66.7-55.6V444.7zm0 0' fill='%23999999'/%3E%3C/svg%3E");
			*width:99.9%;
		}
		img.ke-flash{
			background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 0v1024h1024V0H0zm766.427 327.534c-118.528-3.95-163.584 126.135-163.584 126.135H708.28v111.579s-64.146-.073-151.479 0c-93.038 233.216-250.66 234.46-292.864 233.143-.658-.037-8.667-.073-8.667-.073s.073-95.671-.074-111.8c62.062-.145 128.074-8.008 199.351-198.911 102.071-305.298 311.808-271.653 311.808-271.653v111.58z' fill='%23999999'/%3E%3C/svg%3E")
		}
		img.ke-anchor {
			width:18px;
			height:18px;
			margin:0 3px;
			vertical-align:text-bottom;
			background:#70B4F1 url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M565.862 893.594a367.77 367.77 0 0 0 313.856-363.828 51.2 51.2 0 1 1 102.4 0 470.118 470.118 0 1 1-940.236 0 51.2 51.2 0 0 1 102.4 0 367.82 367.82 0 0 0 312.064 363.52V411.802A200.858 200.858 0 0 1 511.13 17.766a200.806 200.806 0 0 1 54.732 394.036v481.792zM511.078 309.76a91.29 91.29 0 1 0 0-182.528 91.29 91.29 0 0 0 0 182.528z' fill='%23ffffff'/%3E%3C/svg%3E\") no-repeat center;
			*background:#70B4F1
		}
		.ke-script, .ke-noscript, .ke-display-none{
			display:none
		}
		.ke-pagebreak {
			border:1px dotted #AAA;
			font-size:0;
			height:2px;
		}
		pre.prettyprint{
			padding: 10px;
			background: #F5F2F0;
			overflow: auto;
			user-select: none;
			color: #9c5425;
			font-family: Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;
		}
		pre.prettyprint::selection{
			box-shadow: 0 0 1px 1px #7db7ff;
		}
		body.preview embed{
			width:100%;
			height:460px;
		}
	</style>`
}

function _getInitHtml(cssEmpty, bodyClass, cssPath, cssData, isFull) {
	bodyClass = bodyClass ? [bodyClass] : [];
	if (isFull) {
		bodyClass.push('full');
	}
	var dir = _direction === '' ? '' : ' dir="' + _direction + '"',
		styleBody = bodyClass.length ? ' class="' + bodyClass.join(' ') + '"' : '',
		styleHeader = [];
	if (!cssEmpty) {
		styleHeader.push(_getDefaultEditorStyle(isFull))
	}
	if (!_isArray(cssPath)) {
		cssPath = [cssPath];
	}
	_each(cssPath, function(i, path) {
		if (path) {
			styleHeader.push('<link href="' + path + '" rel="stylesheet" />');
		}
	});
	if (cssData) {
		styleHeader.push('<style>' + cssData + '</style>');
	}
	styleHeader = styleHeader.join('');
	return `<html${dir}>
		<head>
			<meta charset="utf-8" /><title></title>
			${styleHeader}
		</head>
		<body${styleBody}></body>
	</html>`;
}

function _elementVal(knode, val) {
	if (knode.hasVal()) {
		if (val === undefined) {
			var html = knode.val();
			// 去除内容为空的p标签
			// https://github.com/kindsoft/kindeditor/pull/52
			html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '');
			return html;
		}
		return knode.val(val);
	}
	return knode.html(val);
}

// create KEdit class
function KEdit(options) {
	this.init(options);
}
_extend(KEdit, KWidget, {
	init : function(options) {
		var self = this;
		KEdit.parent.init.call(self, options);

		self.srcElement = K(options.srcElement);
		self.div.addClass('ke-edit');
		self.designMode = _undef(options.designMode, true);
		self.beforeGetHtml = options.beforeGetHtml;
		self.beforeSetHtml = options.beforeSetHtml;
		self.afterSetHtml = options.afterSetHtml;

		var bodyClass = options.bodyClass,
			cssPath = options.cssPath,
			cssData = options.cssData,
			isDocumentDomain = location.protocol != 'res:' && location.host.replace(/:\d+/, '') !== document.domain,
			srcScript = ('document.open();' +
				(isDocumentDomain ? 'document.domain="' + document.domain + '";' : '') +
				'document.close();'),
			iframeSrc = _IE ? ' src="javascript:void(function(){' + encodeURIComponent(srcScript) + '}())"' : '';
		self.iframe = K('<iframe class="ke-edit-iframe" hidefocus="true" frameborder="0"' + iframeSrc + '></iframe>').css('width', '100%');
		self.textarea = K('<textarea class="ke-edit-textarea" hidefocus="true"></textarea>').css('width', '100%');
		self.tabIndex = isNaN(parseInt(options.tabIndex, 10)) ? self.srcElement.attr('tabindex') : parseInt(options.tabIndex, 10);
		self.iframe.attr('tabindex', self.tabIndex);
		self.textarea.attr('tabindex', self.tabIndex);

		if (self.width) {
			self.setWidth(self.width);
		}
		if (self.height) {
			self.setHeight(self.height);
		}
		if (self.designMode) {
			self.textarea.hide();
		} else {
			self.iframe.hide();
		}
		function ready() {
			var doc = _iframeDoc(self.iframe);
			doc.open();
			if (isDocumentDomain) {
				doc.domain = document.domain;
			}
			doc.write(_getInitHtml(self.options.cssEmpty, bodyClass, cssPath, cssData, self.options.isFull));
			doc.close();
			self.win = self.iframe[0].contentWindow;
			self.doc = doc;
			var cmd = _cmd(doc);
			// add events
			self.afterChange(function(e) {
				cmd.selection();
			});
			// [WEBKIT] select an image after click the image
			if (_WEBKIT) {
				K(doc).click(function(e) {
					if (K(e.target).name === 'img') {
						cmd.selection(true);
						cmd.range.selectNode(e.target);
						cmd.select();
					}
				});
			} else if (_IE) {
				// Fix bug: https://github.com/kindsoft/kindeditor/issues/53
				self._mousedownHandler = function() {
					var newRange = cmd.range.cloneRange();
					newRange.shrink();
					if (newRange.isControl()) {
						self.blur();
					}
				};
				K(document).mousedown(self._mousedownHandler);
				// [IE] bug: clear iframe when press backspase key
				K(doc).keydown(function(e) {
					if (e.which == 8) {
						cmd.selection();
						var rng = cmd.range;
						if (rng.isControl()) {
							rng.collapse(true);
							K(rng.startContainer.childNodes[rng.startOffset]).remove();
							e.preventDefault();
						}
					}
				});
			}
			self.cmd = cmd;
			self.html(_elementVal(self.srcElement));
			if (_IE) {
				doc.body.disabled = true;
				doc.body.contentEditable = true;
				doc.body.removeAttribute('disabled');
			} else {
				doc.designMode = 'on';
			}
			if (options.afterCreate) {
				options.afterCreate.call(self);
			}
		}
		if (isDocumentDomain) {
			self.iframe.bind('load', function(e) {
				self.iframe.unbind('load');
				if (_IE) {
					ready();
				} else {
					setTimeout(ready, 0);
				}
			});
		}
		self.div.append(self.iframe);
		self.div.append(self.textarea);
		self.srcElement.hide();
		!isDocumentDomain && ready();
	},
	setWidth : function(val) {
		var self = this;
		val = _addUnit(val);
		self.width = val;
		self.div.css('width', val);
		return self;
	},
	setHeight : function(val) {
		var self = this;
		val = _addUnit(val);
		self.height = val;
		self.div.css('height', val);
		self.iframe.css('height', val);
		// 校正IE6和IE7的textarea高度
		if ((_IE && _V < 8) || _QUIRKS) {
			val = _addUnit(_removeUnit(val) - 2);
		}
		self.textarea.css('height', val);
		return self;
	},
	remove : function() {
		var self = this, doc = self.doc;
		// remove events
		K(doc.body).unbind();
		K(doc).unbind();
		K(self.win).unbind();
		if (self._mousedownHandler) {
			K(document).unbind('mousedown', self._mousedownHandler);
		}
		// remove elements
		_elementVal(self.srcElement, self.html());
		self.srcElement.show();
		// doc.write('');
		self.iframe.unbind();
		self.textarea.unbind();
		KEdit.parent.remove.call(self);
	},
	html : function(val, isFull) {
		var self = this, doc = self.doc;
		// design mode
		if (self.designMode) {
			var body = doc.body;
			// get
			if (val === undefined) {
				val = body.innerHTML;
                if (self.beforeGetHtml) {
                    val = self.beforeGetHtml(val);
                }
                if (isFull) {
                    val = '<!doctype html><html><head>'+doc.getElementsByTagName('head')[0].innerHTML+'</head><body class="'+self.options.bodyClass+' preview">' + val + '</body></html>';
                }
				// bugfix: Firefox自动生成一个br标签
				if (_GECKO && val == '<br />') {
					val = '';
				}
				return val;
			}
			// set
			if (self.beforeSetHtml) {
				val = self.beforeSetHtml(val);
			}
			// IE9 Bugfix: https://github.com/kindsoft/kindeditor/issues/62
			if (_IE && _V >= 9) {
				val = val.replace(/(<.*?checked=")checked(".*>)/ig, '$1$2');
			}
			K(body).html(val);
			if (self.afterSetHtml) {
				self.afterSetHtml();
			}
			return self;
		}
		// source mode
		if (val === undefined) {
			return self.textarea.val();
		}
		self.textarea.val(val);
		return self;
	},
	design : function(bool) {
		var self = this, val;
		if (bool === undefined ? !self.designMode : bool) {
			if (!self.designMode) {
				val = self.html();

				self.designMode = true;
				self.textarea.hide();

				self.html(val);

				// cache
				var iframe = self.iframe;
				var height = _removeUnit(self.height);

				iframe.height(height - 2);
				iframe.show();

				// safari iframe scrollbar hack
				setTimeout(function() {
					iframe.height(height);
				}, 0);
			}
		} else {
			if (self.designMode) {
				val = self.html();
				self.designMode = false;
				self.html(val);
				self.iframe.hide();
				self.textarea.show();
			}
		}
		return self.focus();
	},
	focus : function() {
		var self = this;
		self.designMode ? self.win.focus() : self.textarea[0].focus();
		return self;
	},
	blur : function() {
		var self = this;
		if (_IE) {
			var input = K('<input type="text" style="float:left;width:0;height:0;padding:0;margin:0;border:0;" value="" />', self.div);
			self.div.append(input);
			input[0].focus();
			input.remove();
		} else {
			self.designMode ? self.win.blur() : self.textarea[0].blur();
		}
		return self;
	},
	afterChange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
			}
		});
		K(doc).mouseup(fn).contextmenu(fn);
		K(self.win).blur(fn);
		function timeoutHandler(e) {
			setTimeout(function() {
				fn(e);
			}, 1);
		}
		K(body).bind('paste', timeoutHandler);
		K(body).bind('cut', timeoutHandler);
		return self;
	}
});

function _edit(options) {
	return new KEdit(options);
}

K.EditClass = KEdit;
K.edit = _edit;
K.iframeDoc = _iframeDoc;
