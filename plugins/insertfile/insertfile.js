/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/
var _file_useForm,
   _file_uploadJson,
   _file_name,
   _file_params,
   _file_formatUrl,
   _file_fillDescAfter,
   _file_allowManager,
   _file_uploadDirs = {
		insertfile:'file',
		flash:'flash',
		media:'media',
		image:'image'
   };

// 对齐方式 svg   
function getAlignSvg(pos) {
	var img;
	var line = 'M1 14L23 14L23 16L1 16ZM1 18L23 18L23 20L1 20ZM1 22L23 22L23 24L1 24Z';
	if (pos > 1) {
		img = 'M11 1L23 1L23 12L11 12Z';
		line += 'M1 22L23 22L23 24L1 24ZM1 3L10 3L10 5L1 5ZM1 8L10 8L10 10L1 10Z';
	} else if (pos > 0) {
		img = 'M1 1L13 1L13 12L1 12Z';
		line += 'M14 3L23 3L23 5L14 5ZM14 8L23 8L23 10L14 10Z';
	} else {
		img = 'M6 1L18 1L18 12L6 12Z';
	}
	return '&nbsp;<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="vertical-align:middle"><path d="'+img+'" fill="#999"/><path d="'+line+'" fill="#bbb"/></svg>'
}

// 文件通用弹窗框  
function openFileDialog(self, K, name, fileUrl, fileTitle, allowUpload, options) {
	var lang = self.lang(name + '.'),
		isMedia = name === 'media',
		isImage = !isMedia && name === 'image',
		clickFn = options ? options.clickFn : null;
		html = `<div style="padding:20px;">
		<div class="ke-dialog-row">
			<label for="keUrl">${lang.url}</label>
			<input type="text" id="keUrl" name="url" style="width:205px;" />
			<input type="button" class="ke-upload-button" value="${lang.upload}" />
			<span class="ke-button-outer" style="margin-left:5px;">
				<input type="button" class="ke-button" name="viewServer" value="${lang.viewServer}" />
			</span>
		</div>`;
	if (name === 'insertfile') {
		html += 
		`<div class="ke-dialog-row">
			<label for="keTitle">${lang.title}</label>
			<input type="text" id="keTitle" name="title" style="width:335px;" /></div>
		</div>`
	} else if (isMedia || name === 'flash') {
		html += 
		`<div class="ke-dialog-row">
			<label for="keWidth">${lang.width}</label>
			<input type="text" id="keWidth" class="ke-input-number" name="width" maxlength="4" /> &nbsp;
			${lang.height} &nbsp; <input type="text" id="keHeight" class="ke-input-number" name="height" maxlength="4" /> &nbsp;
			${isMedia ? '<input type="checkbox" id="keAutostart" name="autostart" style="vertical-align:middle"/><label for="keAutostart" style="width:auto">' + lang.autostart + '</label>' : ''}
		</div>`
	} else {
		html += 
		`<div class="ke-dialog-row">
			<label>${lang.align}</label>
			<label title="${lang.defaultAlign}">
			<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" />${getAlignSvg(0)}</label>
			<label title="${lang.leftAlign}">
			<input type="radio" name="align" class="ke-inline-block" value="left" />${getAlignSvg(1)}</label>
			<label title="${lang.rightAlign}">
			<input type="radio" name="align" class="ke-inline-block" value="right" />${getAlignSvg(2)}</label>
		</div>
		<div class="ke-dialog-row">
			<label for="remoteTitle">${lang.imgTitle}</label>
			<input type="text" id="remoteTitle" name="title" style="width:200px;" />
		</div>
		<div class="ke-dialog-row">
			<label for="remoteWidth">${lang.size}</label>
			${lang.width}&nbsp;
				<input type="text" id="remoteWidth" class="ke-input-number" name="width" maxlength="4" />&nbsp;
			${lang.height}&nbsp;
				<input type="text" class="ke-input-number" name="height" maxlength="4" />&nbsp;
			<span title="${lang.keepAspect}" class="ke-img-svg ke-img-svgon">
				<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M839.6 430.207h-72.59V261.461c0-141.567-114.732-256.3-256.3-256.3s-256.301 114.733-256.301 256.3v168.746H181.99c-34.919 0-63.301 28.383-63.301 63.301V955.71c0 16.858 6.708 32.855 18.577 44.896 11.87 11.87 28.039 18.578 44.896 18.578h658.47c16.857 0 32.855-6.709 44.896-18.578 11.869-11.869 18.577-28.038 18.577-44.896V493.508c0-16.857-6.708-33.198-18.75-45.067-12.556-11.87-28.898-18.406-45.755-18.234zm-170.981 0H352.8v-164.79c0-87.21 70.698-157.908 157.909-157.908s157.909 70.698 157.909 157.909v164.79zm0 0"/></svg>
			</span>
			<span title="${lang.resetSize}" class="ke-img-svg">
				<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M232.4 362.7c14.7-27.3 33.2-52.2 55.4-74.4C317.1 259 351.2 236 389.1 220c39.2-16.6 80.9-25 123.9-25 39.3 0 77.5 7 113.8 20.9 35 13.4 67.2 32.8 95.6 57.6 52.8 46.1 88.8 108.1 102.7 176H955v-.2C923.8 233.1 737.8 67 513 67c-156.3 0-293.9 80.3-373.6 202L65 194v256h254l-86.6-87.3zM960 577H706l87.2 87.9c-18 33.2-41.9 63.3-70.9 88.6-28.4 24.8-60.6 44.2-95.6 57.6C590.5 825 552.3 832 513 832s-77.5-7-113.7-20.9c-35-13.4-67.2-32.8-95.6-57.6-52.8-46.1-88.9-108.1-102.7-176.1H71.1c0 .1 0 .3.1.4C102.3 794 288.3 960 513 960c156.1 0 293.4-80.1 373.2-201.3L960 833V577z"/></svg>
			</span>
			<a style="color:#70B4F1;cursor:pointer">clear</a>
		</div>`
	}
	html += '</div>';

	// 创建弹出层
	var titleBox, widthBox, heightBox, alignBox, locksizeBtn, refreshBtn, clearSizeBtn, autostartBox,
	dialog = self.createDialog({
		name : name,
		width : 500,
		title : self.lang(name),
		body : html,
		yesBtn : {
			name : self.lang('yes'),
			click : function(e) {
				var url = K.trim(urlBox.val());
				if (url == 'http://' || K.invalidUrl(url)) {
					alert(self.lang('invalidUrl'));
					urlBox[0].focus();
					return;
				}
				var insertHtm = null;
				if (name === 'insertfile') {
					var title = titleBox.val();
					if (K.trim(title) === '') {
						title = url;
					}
					if (clickFn) {
						clickFn.call(self, url, title);
					} else {
						insertHtm = '<a class="ke-insertfile" href="' + url + '" data-ke-src="' + url + '" target="_blank">' + title + '</a>';
					}
				} else {
					var width = widthBox.val(),
						height = heightBox.val();
					if (isImage) {
						var title = titleBox.val(), align = '';
						alignBox.each(function() {
							if (this.checked) {
								align = this.value;
								return false;
							}
						});
						clickFn.call(self, url, title, width, height, 0, align);
						return;
					}
					insertHtm = isMedia ? K.mediaImg({
						src : url,
						type : K.mediaType(url),
						width : width,
						height : height,
						autostart : autostartBox[0].checked ? 'true' : 'false',
						loop : 'true'
					}) : K.mediaImg({
						src : url,
						type : K.mediaType('.swf'),
						width : width,
						height : height,
						quality : 'high'
					});
				}
				if (insertHtm) {
					self.insertHtml(insertHtm).hideDialog().focus();
				}
			}
		},
		beforeRemove : function() {
			if (viewServerBtn) {
				viewServerBtn.unbind();
			}
			if (isImage) {
				urlBox.unbind();
				widthBox.unbind();
				heightBox.unbind();
				locksizeBtn.unbind();
				refreshBtn.unbind();
				clearSizeBtn.unbind();
			}
		}
	}),
	div = dialog.div,
	urlBox = K('[name="url"]', div),
	viewServerBtn = K('[name="viewServer"]', div),
	dirName = _file_uploadDirs[name],
	addWidth = 0;

	// 上传按钮
	if (allowUpload) {
		var uploadbutton = K.uploadbutton({
			form: _file_useForm,
			button : K('.ke-upload-button', div)[0],
			fieldName : _file_name,
			url : K.addParam(_file_uploadJson, 'dir=' + dirName),
			extraParams : _file_params,
			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var url = data.url;
					if (_file_formatUrl) {
						url = K.formatUrl(url, 'absolute');
					}
					if (self.afterUpload) {
						self.afterUpload.call(self, url, data, name);
					}
					if (isImage && !_file_fillDescAfter) {
						// 直接插入图片
						clickFn.call(self, url, data.title, data.width, data.height, data.border, data.align);
					} else {
						urlBox.val(url);
					}
				} else {
					alert(data.message);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			dialog.showLoading(self.lang('uploadLoading'));
			uploadbutton.submit();
		});
	} else {
		K('.ke-upload-button', div).remove();
		addWidth += 60;
	}

	// 浏览按钮
	if (_file_allowManager) {
		viewServerBtn.click(function(e) {
			self.loadPlugin('filemanager', function() {
				self.plugin.filemanagerDialog({
					viewType : 'LIST',
					dirName : dirName,
					clickFn : function(url, title) {
						if (self.dialogs.length > 1) {
							urlBox.val(url);
							if (self.afterSelectFile) {
								self.afterSelectFile.call(self, url);
							}
							self.hideDialog();
						}
					}
				});
			});
		});
	} else {
		viewServerBtn.parent().remove();
		viewServerBtn = null;
		addWidth += 70;
	}
	if (addWidth) {
		urlBox.css('width', (205 + addWidth) + 'px')
	}

	// 设置初始值
	urlBox.val(fileUrl);
	if (name === 'insertfile') {
		titleBox = K('[name="title"]', div).val(fileTitle);
	} else if (isMedia || name === 'flash') {
		var img;
		if (isMedia) {
			autostartBox = K('[name="autostart"]', div);
			img = self.plugin.getSelectedMedia();
		} else {
			img = self.plugin.getSelectedFlash();
		}
		widthBox = K('[name="width"]', div);
		heightBox = K('[name="height"]', div);
		if (img) {
			var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
			urlBox.val(attrs.src);
			widthBox.val(img[0].style.width || attrs.width || '');
			heightBox.val(img[0].style.height || attrs.height || '');
			if (isMedia) {
				autostartBox[0].checked = (attrs.autostart === 'true');
			}
		}
	} else {
		var svgBtns = K('.ke-img-svg', div);
		locksizeBtn = K(svgBtns[0]);
		refreshBtn = K(svgBtns[1]);
		clearSizeBtn = K('a', div);
		widthBox = K('[name="width"]', div);
		heightBox = K('[name="height"]', div);
		alignBox = K('[name="align"]', div);
		titleBox = K('[name="title"]', div).val(fileTitle);
		var lockAspect = true,
		    originalWidth = 0,
			originalHeight = 0,
			setSize = function(width, height) {
				widthBox.val(width);
				heightBox.val(height);
				originalWidth = width;
				originalHeight = height;
			},
			reloadSize = function() {
				var tempImg = K('<img src="' + urlBox.val() + '" />', document).css({
					position : 'absolute',
					visibility : 'hidden',
					top :  '-1000px',
					left : 0
				});
				tempImg.bind('load', function() {
					setSize(tempImg.width(), tempImg.height());
					tempImg.remove();
				});
				K(document.body).append(tempImg);
			};
		locksizeBtn.click(function(){
			if (lockAspect) {
				lockAspect = false;
				locksizeBtn.removeClass('ke-img-svgon')
			} else {
				lockAspect = true;
				locksizeBtn.addClass('ke-img-svgon')
			}
		});
		widthBox.bind('keyup', function() {
			if (lockAspect && originalWidth > 0) {
				heightBox.val(Math.round(originalHeight / originalWidth * parseInt(this.value, 10)));
			}
		});
		heightBox.bind('keyup', function() {
			if (lockAspect && originalHeight > 0) {
				widthBox.val(Math.round(originalWidth / originalHeight * parseInt(this.value, 10)));
			}
		});
		clearSizeBtn.click(function() {
			widthBox.val('');
			heightBox.val('');
		});
		urlBox.change(reloadSize);
		refreshBtn.click(reloadSize);
		titleBox.val(fileTitle);
		setSize(
			K.undef(options.imageWidth, ''),
			K.undef(options.imageHeight, '')
		);
		var imageAlign = K.undef(options.imageAlign, '');
		alignBox.each(function() {
			if (this.value === imageAlign) {
				this.checked = true;
				return false;
			}
		});
	}
	urlBox[0].focus();
	urlBox[0].select();
}

// 挂载插件, 这几个插件非常类似, 所以干脆统一挂载, 还能减小 js 体积
(function() {
	var _file_plugins = ['insertfile', 'flash', 'media', 'image'],
		configNames = {
			insertfile:'allowFileUpload',
			flash:'allowFlashUpload',
			media:'allowMediaUpload',
			image:'allowImageUpload'
		}, i;
	for (i=0; i<_file_plugins.length; i++) {  (function(name) {
		KindEditor.plugin(name, function(K) {
			var self = this,
				allowUpload = K.undef(self[configNames[name]], true);
			
			// 重置
			_file_useForm = K.undef(self.forceIframeTransport, false) || window.FormData === undefined;
			_file_uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
			_file_name = K.undef(self.filePostName, 'imgFile');
			_file_params = K.undef(self.extraFileUploadParams, null);
			_file_formatUrl = K.undef(self.formatUploadUrl, true);
			_file_fillDescAfter = K.undef(self.fillDescAfterUploadImage, true);
			_file_allowManager = K.undef(self.allowFileManager, false);

			var editFn = function() {
				openFileDialog(self, K, name, 'http://', '', allowUpload, {});
			};

			// 兼容原版, 保留插件注册
			if (name === 'insertfile') {
				self.plugin.fileDialog = function(options) {
					var fileUrl = K.undef(options.fileUrl, 'http://'),
						fileTitle = K.undef(options.fileTitle, '');
					openFileDialog(self, K, name, fileUrl, fileTitle, allowUpload, options);
				}
			} else if (name === 'flash') {
				self.plugin.flash = {
					edit: editFn,
					remove: function() {
						self.plugin.getSelectedFlash().remove();
						// [IE] 删除图片后立即点击图片按钮出错
						self.addBookmark();
					}
				}
			} else if (name === 'media') {
				self.plugin.media = {
					edit: editFn,
					remove: function() {
						self.plugin.getSelectedMedia().remove();
						self.addBookmark();
					}
				}
			} else {
				self.plugin.imageDialog = function(options) {
					var fileUrl = K.undef(options.imageUrl, 'http://'),
						fileTitle = K.undef(options.imageTitle, ''),
						showLocal = allowUpload;
					// 这里仅兼容原版的 showLocal=false,  showRemote=false 不再兼容了
					if ('showLocal' in options && !options.showLocal) {
						showLocal = false;
					}
					openFileDialog(self, K, name, fileUrl, fileTitle, showLocal, options);
				};
				self.plugin.image = {
					edit: function() {
						var img = self.plugin.getSelectedImage();
						// 编辑时 width/height 除非上次设置了, 否则仍然显示为空
						// 因为大部分情况下 img 尺寸在前端是用 css 控制的, 这里尽量不添加
						// 除非手工设置
						self.plugin.imageDialog({
							imageUrl : img ? img.attr('data-ke-src') : 'http://',
							imageWidth : img ? img.attr('width') : '',
							imageHeight : img ? img.attr('height') : '',
							imageTitle : img ? img.attr('title') : '',
							imageAlign : img ? img.attr('align') : '',
							clickFn : function(url, title, width, height, border, align) {
								if (img) {
									img.attr('src', url);
									img.attr('data-ke-src', url);
									width ? img.attr('width', width) : img.removeAttr('width');
									height ? img.attr('height', height) : img.removeAttr('height');
									align ? img.attr('align', align) : img.removeAttr('align');
									title ? img.attr('title', title) : img.removeAttr('title');
								} else {
									self.exec('insertimage', url, title, width, height, border, align);
								}
								// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
								setTimeout(function() {
									self.hideDialog().focus();
								}, 0);
							}
						});
					},
					remove: function() {
						var target = self.plugin.getSelectedImage();
						if (target.parent().name == 'a') {
							target = target.parent();
						}
						target.remove();
						self.addBookmark();
					}
				}
			}
			self.clickToolbar(name, name === 'image' ? self.plugin.image.edit : editFn);
		});
	})(_file_plugins[i]); }
})();