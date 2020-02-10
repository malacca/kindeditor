
function KUploadButton(options) {
	this.init(options);
}
function _makeExtraParams(fn) {
	if (typeof fn !== 'function') {
		return {};
	}
	var params = fn();
	return params||{};
}
_extend(KUploadButton, {
	init : function(options) {
		var self = this,
			useForm = options.form,
			button = K(options.button),
			fieldName = options.fieldName || 'file',
			url = options.url || '',
			title = button.val(),
			cls = button[0].className || '',
			target = 'kindeditor_upload_iframe_' + new Date().getTime();
		options.afterError = options.afterError || function(str) {
			alert(str);
		};
		var html = [
			'<div class="ke-inline-block ' + cls + '">',
			'<span class="ke-button-outer"><button class="ke-button">' + title + '</button></span>',
		];
		if (useForm) {
			var extraParams = _makeExtraParams(options.extraParams);
			url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_iframe=1';
			html.push('<iframe name="' + target + '" style="display:none;"></iframe><form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + url + '">');
			for(var k in extraParams){
				html.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
			}
		} else {
			html.push('<div class="ke-upload-area">');
		}
		html.push(
			'<input type="file" class="ke-upload-file" name="' + fieldName + '" tabindex="-1" />',
			useForm ? '</form>' : '</div>',
			'</div>'
		);
		html = html.join("");
		var div = K(html, button.doc);
		button.hide();
		button.before(div);

		self.div = div;
		self.button = button;
		self.iframe = useForm ? K('iframe', div) : null;
		self.form = useForm ? K('form', div) : null;
		self.fileBox = K('.ke-upload-file', div);
		self.options = options;
	},
	formSubmit: function() {
		var self = this,
			iframe = self.iframe,
			form = self.form[0];
		iframe.bind('load', function() {
			iframe.unbind();
			form.reset();
			var doc = K.iframeDoc(iframe),
				pre = doc.getElementsByTagName('pre')[0],
				str = '', data;
			if (pre) {
				str = pre.innerHTML;
			} else {
				str = doc.body.innerHTML;
			}
			// Bugfix: https://github.com/kindsoft/kindeditor/issues/81
			str = _unescape(str);
			// Bugfix: [IE] 上传图片后，进度条一直处于加载状态。
			iframe[0].src = 'javascript:false';
			try {
				data = K.json(str);
			} catch (e) {
				self.options.afterError.call(self, '<!doctype html><html>' + doc.body.parentNode.innerHTML + '</html>');
			}
			if (data) {
				self.options.afterUpload.call(self, data);
			}
		});
		form.submit();
		return self;
	},
	submit : function() {
		var self = this,
			options = self.options;
		if (options.form) {
			return self.formSubmit();
		}
		var xhr = new XMLHttpRequest(),
			formData = new FormData(),
			extraParams = _makeExtraParams(options.extraParams);
		xhr.withCredentials = true;	
		xhr.onload = function() {
			// 清空 file input
			var tempForm = document.createElement('form');
			self.fileBox.before(tempForm);
			K(tempForm).append(self.fileBox);
			tempForm.reset();
			K(tempForm).remove(true);

			var data;
			if (xhr.status !== 200) {
				data = {error:1, message:'Response Http:' + xhr.status}
			} else {
				try {
					data = K.json(xhr.responseText);
				} catch (e) {
					self.options.afterError.call(self, '<!doctype html><html>' + xhr.responseText + '</html>');
				}
			}
			if (data) {
				self.options.afterUpload.call(self, data);
			}
		};
		for(var k in extraParams){
			formData.append(k, extraParams[k]);
		}
		formData.append(options.fieldName || 'file', self.fileBox[0].files[0]);
		xhr.open("POST", options.url);
		xhr.send(formData);
		return self;
	},
	remove : function() {
		var self = this;
		if (self.fileBox) {
			self.fileBox.unbind();
		}
		if (self.iframe) {
			self.iframe.remove();
		}
		self.div.remove();
		self.button.show();
		return self;
	}
});

function _uploadbutton(options) {
	return new KUploadButton(options);
}

K.UploadButtonClass = KUploadButton;
K.uploadbutton = _uploadbutton;

