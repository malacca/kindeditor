/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('preview', function(K) {
	var self = this, name = 'preview';
	self.clickToolbar(name, function() {
		var html = 
			`<div style="border-top:1px solid #dadada;">
				<iframe class="ke-preview" frameborder="0" style="width:100%;height:500px;"></iframe>
			</div>`,
			dialog = self.createDialog({
				name : name,
				width : 780,
				title : self.lang(name),
				body : html
			}),
			iframe = K('iframe', dialog.div),
			doc = K.iframeDoc(iframe);
		doc.open();
		doc.write(self.fullHtml());
		doc.close();
		iframe[0].contentWindow.focus();
	});
});