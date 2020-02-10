
function _tabs(options) {
	var self = _widget(options),
		remove = self.remove,
		afterSelect = options.afterSelect,
		div = self.div,
		liList = [];
	//create tabs  新增: 可自定义 className
	div.addClass(options.addClass ? options.addClass : 'ke-tabs')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	var ul = K('<ul class="ke-clearfix"></ul>');
	div.append(ul);
	//add a tab
	self.add = function(tab) {
		var li = K('<li>' + tab.title + '</li>');
		li.data('tab', tab);
		liList.push(li);
		ul.append(li);
		return self;
	};
	self.selectedIndex = 0;
	//select a tab
	self.select = function(index) {
		self.selectedIndex = index;
		_each(liList, function(i, li) {
			li.unbind();
			if (i === index) {
				li.addClass('selected');
				K(li.data('tab').panel).show('');
			} else {
				li.removeClass('selected').removeClass('on')
				.mouseover(function() {
					K(this).addClass('on');
				})
				.mouseout(function() {
					K(this).removeClass('on');
				})
				.click(function() {
					self.select(i);
				});
				K(li.data('tab').panel).hide();
			}
		});
		if (afterSelect) {
			afterSelect.call(self, index);
		}
		return self;
	};
	//remove tabs
	self.remove = function() {
		_each(liList, function() {
			this.remove();
		});
		ul.remove();
		remove.call(self);
		return self;
	};
	return self;
}

K.tabs = _tabs;
