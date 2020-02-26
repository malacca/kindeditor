
// create KMenu class
function KMenu(options) {
	this.init(options);
}
_extend(KMenu, KWidget, {
	init : function(options) {
		var self = this;
		options.z = options.z || 811213;
		KMenu.parent.init.call(self, options);
		self.centerLineMode = _undef(options.centerLineMode, true);
		self.div.addClass('ke-menu').bind('click,mousedown', function(e){
			e.stopPropagation();
		}).attr('unselectable', 'on');
	},
	// 新增: menu 尺寸过大, 可能导出弹出层超出可视区域, 可使用该方法重新定位弹出层的 left 值
	autoLeft: function(x) {
		var self = this;
		if (!arguments.length) {
			x = document.body.clientWidth - self.div.width()
			if (x >= self.options.x) {
				return;
			}
		}
		KMenu.parent.pos.call(self, x, null);
	},
	addItem : function(item) {
		var self = this;
		if (item.title === '-') {
			self.div.append(K('<div class="ke-menu-separator"></div>'));
			return;
		}
		// 新增一个判断, 在 rmove 时, 没菜单就没必要 unbind 了
		if (!self._hasMenus) {
			self._hasMenus = true;
		}
		var itemDiv = K('<div class="ke-menu-item" unselectable="on"></div>'),
			leftDiv = K('<div class="ke-inline-block ke-menu-item-left"></div>'),
			rightDiv = K('<div class="ke-inline-block ke-menu-item-right"></div>'),
			height = _addUnit(item.height),
			iconClass = _undef(item.iconClass, '');
		self.div.append(itemDiv);
		if (height) {
			itemDiv.css('height', height);
			rightDiv.css('line-height', height);
		}
		var centerDiv;
		if (self.centerLineMode) {
			centerDiv = K('<div class="ke-inline-block ke-menu-item-center"></div>');
			if (height) {
				centerDiv.css('height', height);
			}
		}
		itemDiv.mouseover(function(e) {
			K(this).addClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.addClass('ke-menu-item-center-on');
			}
		})
		.mouseout(function(e) {
			K(this).removeClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.removeClass('ke-menu-item-center-on');
			}
		})
		.click(function(e) {
			item.click.call(K(this));
			e.stopPropagation();
		})
		.append(leftDiv);
		if (centerDiv) {
			itemDiv.append(centerDiv);
		}
		itemDiv.append(rightDiv);
		if (iconClass !== '') {
			leftDiv.html('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ' + iconClass + '"></span>');
			if (item.checked) {
				itemDiv.addClass('ke-menu-item-checked');
			}
		} else if (item.checked) {
			iconClass = 'ke-icon-checked';
		}
		rightDiv.html(item.title);
		return self;
	},
	remove : function() {
		var self = this;
		if (self.options.beforeRemove) {
			self.options.beforeRemove.call(self);
		}
		// 新增
		if (self._hasMenus) {
			K('.ke-menu-item', self.div[0]).unbind();
		}
		KMenu.parent.remove.call(self);
		return self;
	}
});

function _menu(options) {
	return new KMenu(options);
}

K.MenuClass = KMenu;
K.menu = _menu;
