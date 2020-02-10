/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('emoticons', function(K) {
	var self = this, name = 'emoticons', lastIndex = 0;
	/**
	 * 可添加多组表情包, 可考虑结合斗图API做一个搜索功能
	 * 配置信息: {
	 *  name:''        分组名称
	 *  rows:10,       每行显示个数
	 *  preview:false, 是否支持预览,比如 cell 显示为 Jpg, 预览 Gif
	 *  baseUrl:'',    图片 url 前缀
	 *  lists:[    表情列表
	 *     'aaaa',     #可以是任意值, 会传递给 creatCell 自定义创建元素
	 *     'bbb.jpg',  #可以直接是图片名称, 不自定义 creatCell 的情况下, 会直接创建 img 元素
	 *     [startNum, endNum, append, prepend],  #可通过数组批量指定
	 *  ],
	 *  insertCell:function(src, index){}   创建表情插入到 td cell 中, 默认为创建 <img src""/>
	 *  insertEditor:function(src, index){}   插入到编辑器的 Html 代码，默认为 <img src""/>
	 * }
	 */
	var qqPath = self.emoticonsPath || self.pluginsPath + 'emoticons/images/';
	var emojiGroup = [
		{
			name:'QQ表情',
			preview: self.allowPreviewEmoticons === undefined ? true : self.allowPreviewEmoticons,
			baseUrl: qqPath,
			rows: 10,
			lists: [
				[0, 134, '.gif']
			],
			insertCell: function(src, index) {
				return '<span class="ke-qqimg" style="background-image:url(' + qqPath + 'static.png);' + 
				'background-position:-'+(24 * index)+'px 0px' + 
				'"></span>';
			},
			insertEditor: function(src, index) {
				return '<img src="'+src+'" class="emoji_qq"/>';
			}
		},
		{
			name:'Emoji',
			rows: 10,
			lists: (
				'😃 😁 😆 😅 😂 😉 😍 😘 😝 😏 😪 😷 😵 😎 😳 😢 😭 😡 💪 👊 👍 👎 👌 👏 👈 👉 👆 👇 🙏 👀 👃 👂 👄 ' + 
				'🍚 🍜 🍝 🍧 🎂 🍳 🍟 🍔 🍺 ☕ 🍎 🍓 🍌 🍉 💰 💯 🏃 🐒 🌹 🍭 🚑 ⏰ 🌙 🌟 ⛅ ☂ ⛄ 🔥 🏆 ⚽ 🏀 🎯 💄 ☎ 📙 🚹 🚺'
			).split(' '),
			insertCell: function(src, index) {
				return '<span>'+src+'</span>';
			},
			insertEditor: function(src, index) {
				return src;
			}
		}
	];
	// 绑定标签 cell 事件
	function bindCellEvent(cell, group, src, index){
		cell.click(function(e) {
			var htm = group.insertEditor ? group.insertEditor(src, index) : '<img src="'+src+'" />';
			self.insertHtml(htm).hideMenu().focus();
			e.stop();
		})
		if (!group.preview) {
			return;
		}
		var first = cell.first(), preview, loaded, mousein;
		var toggle = function(show) {
			if (!loaded) {
				return;
			}
			if (show && mousein) {
				first.hide();
				preview.show();
			} else if (!show && !mousein) {
				first.show();
				preview.hide();
			}
		};
		cell.mouseenter(function() {
			mousein = true;
			if (loaded) {
				toggle(true);
			} else if (!preview) {
				preview = K('<img src="'+src+'" />').hide().bind('load', function() {
					loaded = true;
					toggle(true);
				}).appendTo(cell);
			}
		}).mouseleave(function() {
			mousein = false;
			toggle(false);
		})
	}
	function createTable(elements, index) {
		// 整理表情列表
		var group, emojis, len, i, j, size;
		group = emojiGroup[index];
		emojis = [];
		len = group.lists.length;
		for (i=0; i<len; i++) {
			if (K.isArray(group.lists[i])) {
				size = group.lists[i].length;
				for (j = group.lists[i][0]; j <= group.lists[i][1]; j++) {
					emojis.push(
						(size > 3 ? group.lists[i][3] : '')
						+ '' + j + '' +
						(size > 2 ? group.lists[i][2] : '')
					);
				}
			} else {
				emojis.push(group.lists[i])
			}
		}
		// 创建 table
		var table, rows, cell, src;
		len = emojis.length;
		rows = Math.ceil(len / group.rows);
		table = document.createElement('table');
		table.className = 'ke-em-table ke-em-table'+index;
		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.border = 0;
		for (i=0; i<rows; i++) {
			row = table.insertRow(i);
			for(j=0; j<group.rows; j++) {
				cell = K(row.insertCell(j));
				size = group.rows * i + j;
				if (size < len) {
					src = (group.baseUrl ? group.baseUrl : '') + emojis[size];
					cell.attr({
						src: src,
						index: size
					}).append( 
						group.insertCell 
						? group.insertCell(src, size) 
						: '<img src="'+src+'" />'
					);
					elements.push(cell);
					bindCellEvent(cell, group, src, size)
				}
			}
		}
		return table;
	}
	// 绑定 toolban 点击事件
	self.clickToolbar(name, function() {
		var elements = [], len = emojiGroup.length, i, wrapperDiv, menu, tabs, emojiDiv, groups, created = [], htm;
		wrapperDiv = K('<div class="ke-plugin-emoticons"></div>');
		htm = '<div class="ke-em-group">';
		for (i=0; i<len; i++) {
			created[i] = false;
			htm += '<div class="ke-em-list"></div>';
		}
		htm += '</div>';
		wrapperDiv.html(htm);
		menu = K('<div></div>').appendTo(wrapperDiv);
		emojiDiv = wrapperDiv.first();
		groups = emojiDiv.children();
		tabs = K.tabs({
			src : menu,
			addClass: 'ke-em-tab',
			afterSelect : function(i) {
				lastIndex = i;
				if (created[i]) {
					return;
				}
				created[i] = true;
				K(groups[i]).append(createTable(elements, i));
			}
		});
		for (i=0; i<len; i++) {
			tabs.add({
				title : emojiGroup[i].name,
				panel : groups[i]
			});
		}
		var widget = self.createMenu({
			name : name,
			addClass: 'ke-menu-clear',
			beforeRemove : function() {
				K.each(elements, function() {
					this.unbind();
				});
			}
		});
		widget.div.append(wrapperDiv);
		widget.autoLeft();
		tabs.select(lastIndex);
	});
});