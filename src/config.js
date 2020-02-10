
function _getBasePath() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (src && /kindeditor[\w\-\.]*\.js/.test(src)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
}

K.basePath = _getBasePath();

K.options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : true,
	wellFormatMode : true,
	shadowMode : true,
	loadStyleMode : true,
	basePath : K.basePath,
	themesPath : K.basePath + 'themes/',
	langPath : K.basePath + 'lang/',
	pluginsPath : K.basePath + 'plugins/',
	themeType : 'default', // default, simple
	langType : 'zh-CN',
	urlType : '', // "", relative, absolute, domain
	newlineTag : 'p', // p, br
	resizeType : 2, // 0, 1, 2
	syncType : 'form', // "", form
	pasteType : 2, // 0:none, 1:text, 2:HTML
	dialogAlignType : 'page', // page, editor
	useContextmenu : true,
	fullscreenShortcut : false,
	bodyClass : 'ke-content',
	indentChar : '\t', // \t, "  "
	cssPath : '', //String or Array
	cssData : '',
	minWidth : 650,
	minHeight : 100,
	minChangeSize : 50,
	zIndex : 811213,
	pluginAlias: {
		insertfile:['image', 'flash', 'media']
	},
	items : [
        'undo', 'redo', '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'formatblock',
        'fontname',
        'fontsize',
        'lineheight',
        'forecolor',
        'hilitecolor',
        'removeformat',
        'selectall',
        '|',
        'cut',
        'copy',
        'plainpaste',
        'wordpaste',
        'paste',
        'flash',
        'media',
        'insertfile',
        'pagebreak',
        'quickformat',
        '/',
        'justifyleft',
        'justifycenter',
        'justifyright',
        'justifyfull',
        'insertorderedlist',
        'insertunorderedlist',
        'indent',
        'outdent',
        'subscript',
        'superscript',
        '|',
        'emoticons',
        'link',
        'unlink',
        'image',
        'table',
        'baidumap',
        '|',
        'anchor',
        'hr',
        'code',
        'template',
        'clearhtml',
        'preview',
        'print',
        'source',
        'fullscreen',
        // 'about',
        // 'multiimage',
	],
	noDisableItems : ['source', 'fullscreen'],
	colorTable : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	fontSizeTable : ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
	htmlTags : {
		font : ['id', 'class', 'color', 'size', 'face', '.background-color'],
		span : [
			'id', 'class', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
		],
		div : [
			'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height', '.border-collapse'
		],
		'tr,th':[
			'height', 'align', 'valign', 
			'.height', '.text-align', '.vertical-align',
			'.background', '.background-color', 
			'.border', '.border-style', '.border-color'
		],
		td: [
			'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.font-style', '.color', '.font-size', '.font-family', '.font-weight', '.text-decoration', 
			'.width', '.height', '.text-align', '.vertical-align',
			'.background', '.background-color', 
			'.border', '.border-width', '.border-style', '.border-color'
		],
		a : ['id', 'class', 'href', 'target', 'name'],
		embed : ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', 'wmode'],
		img : ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'id', 'class', 'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		pre : ['id', 'class', 'contenteditable'],
		hr : ['id', 'class', '.page-break-after'],
		'br,tbody,strong,b,sub,sup,em,i,u,strike,s,del' : ['id', 'class'],
		iframe : ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width', '.height']
	},
	layout : '<div class="container"><div class="ke-toolheader"><div class="toolbar"></div></div><div class="edit"></div><div class="statusbar"></div></div>'
};
