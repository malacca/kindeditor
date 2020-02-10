/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('template', function(K) {
	var self = this, 
		name = 'template', 
		lang = self.lang(name + '.'),
		htmlPath = self.pluginsPath + name + '/html/';

	function getFilePath(fileName) {
		return htmlPath + fileName + '?ver=' + encodeURIComponent(K.DEBUG ? K.TIME : K.VERSION);
	}
	
	self.clickToolbar(name, function() {
		var options = '';
		K.each(lang.fileList, function(key, val) {
			options += '<option value="' + key + '">' + val + '</option>';
		});
		var html = 
			`<div style="padding:10px 20px;">
				<div class="ke-header">
					<div class="ke-left">
						${lang. selectTemplate} <select>${options}</select>
					</div>
					<div class="ke-right">
						<input type="checkbox" id="keReplaceFlag" name="replaceFlag" value="1" /> 
						<label for="keReplaceFlag">${lang.replaceContent}</label>
					</div>
					<div class="ke-clearfix"></div>
				</div>
				<iframe class="ke-textarea" frameborder="0" style="width:100%;height:340px;background-color:#FFF;"></iframe>
			</div>`;
		var dialog = self.createDialog({
			name : name,
			width : 560,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var doc = K.iframeDoc(iframe);
					self[checkbox[0].checked ? 'html' : 'insertHtml'](doc.body.innerHTML).hideDialog().focus();
				}
			}
		});
		var selectBox = K('select', dialog.div),
			checkbox = K('[name="replaceFlag"]', dialog.div),
			iframe = K('iframe', dialog.div);
		checkbox[0].checked = true;
		iframe.attr('src', getFilePath(selectBox.val()));
		selectBox.change(function() {
			iframe.attr('src', getFilePath(this.value));
		});
	});
});
