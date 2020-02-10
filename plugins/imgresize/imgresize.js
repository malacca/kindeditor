// IE 默认开启了 img table 的 resize
// 非 webkit 直接使用系统自带的通过 command 开启
// webkit 不支持
KindEditor.plugin('imgresize', function (K) {
    if (K.IE) {
        return;
    }
	var self = this;
	function init() {
		var doc = self.cmd.doc;
		if (!K._WEBKIT) {
			doc.execCommand('enableObjectResizing');
			doc.execCommand('enableInlineTableEditing');
			return;
		}
	}
	if (self.isCreated) {
		init();
	} else {
		self.afterCreate(init);
	}
});
