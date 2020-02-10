/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('filemanager', function(K) {
	var self = this, name = 'filemanager',
		fileManagerJson = K.undef(self.fileManagerJson, self.basePath + 'php/file_manager_json.php'),
		lang = self.lang(name + '.');
	function makeFileTitle(filename, filesize, datetime) {
		return filename + ' (' + filesize + ', ' + datetime + ')';
	}

	function bindTitle(el, data) {
		if (data.is_dir) {
			el.attr('title', data.filename);
		} else {
			el.attr('title', makeFileTitle(data.filename, data.filesize, data.datetime));
		}
	}

	function getSvg(folder, big) {
		var path = folder ? 'M927.744 210.944h-384l-32.256-46.08c-32.768-60.928-41.472-92.16-92.16-92.16H96.256c-51.2 0-92.672 41.472-92.672 92.16v693.248c0 51.2 41.472 92.672 92.672 92.672h832c51.2 0 92.672-41.472 92.672-92.672V303.104c-.512-50.688-41.984-92.16-93.184-92.16m0 0z' : 'M658.286 292.571V22.857q12.571 8 20.571 16L912 272q8 8 16 20.571H658.286zm-73.143 18.286q0 22.857 16 38.857t38.857 16h310.857v603.429q0 22.857-16 38.857T896 1024H128q-22.857 0-38.857-16t-16-38.857V54.857q0-22.857 16-38.857T128 0h457.143v310.857z',
			size = big ? 80 : 14;
		return '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'"><path d="'+path+'"/></svg>';
	}

    function getFilePreview(result, data) {
        if (data.is_dir) {
            return getSvg(true, true);
        }
        var filetype = data.filetype || data.filename.split('.').pop();
        if (K.inArray(filetype, ['png', 'jpg', 'gif', 'jpeg']) < 0) {
            return getSvg(false, true);
        }
        var url = K.formatUrl(result.current_url + data.filename, 'absolute');
        return '<img src="'+url+'"/>';
    }

	self.plugin.filemanagerDialog = function(options) {
		var width = K.undef(options.width, 650),
			dirName = K.undef(options.dirName, ''),
			viewType = K.undef(options.viewType, 'VIEW').toUpperCase(), // "LIST" or "VIEW"
			clickFn = options.clickFn,
			html = 
		`<div class="ke-plugin-filemanager">
			<div class="ke-header ke-plugin-filemanager-header">
				<div class="ke-left">
					<a class="ke-inline-block" name="moveupLink" href="javascript:;">${lang.moveup}</a>
				</div>
				<div class="ke-right"> 
					${lang.viewType} 
					<select class="ke-inline-block" name="viewType">
						<option value="VIEW">${lang.viewImage}</option>
						<option value="LIST">${lang.listImage}</option>
					</select>	 
					${lang.orderType}
					<select class="ke-inline-block" name="orderType">
						<option value="NAME">${lang.fileName}</option>
						<option value="SIZE">${lang.fileSize}</option>
						<option value="TYPE">${lang.fileType}</option>
					</select>
				</div>
				<div class="ke-clearfix"></div>
			</div>
			<div class="ke-plugin-filemanager-body"></div>
		</div>`;
		var dialog = self.createDialog({
			name : name,
			width : width,
			title : self.lang(name),
			body : html
		}),
		div = dialog.div,
		moveupLink = K('[name="moveupLink"]', div),
		viewTypeBox = K('[name="viewType"]', div),
		orderTypeBox = K('[name="orderType"]', div),
		bodyDiv = K('.ke-plugin-filemanager-body', div);
		function reloadPage(path, order, func) {
			var param = 'path=' + path + '&order=' + order + '&dir=' + dirName;
			dialog.showLoading(self.lang('ajaxLoading'));
			K.ajax(K.addParam(fileManagerJson, param + '&' + new Date().getTime()), function(data) {
				dialog.hideLoading();
				func(data);
			});
		}

		var elList = [];
		function bindEvent(el, result, data, createFunc) {
			var fileUrl = K.formatUrl(result.current_url + data.filename, 'absolute'),
				dirPath = encodeURIComponent(result.current_dir_path + data.filename + '/');
			if (data.is_dir) {
				el.click(function(e) {
					reloadPage(dirPath, orderTypeBox.val(), createFunc);
				});
			} else {
				el.click(function(e) {
					clickFn.call(this, fileUrl, data.filename);
				});
			}
			elList.push(el);
		}

		function createCommon(result, createFunc) {
			// remove events
			K.each(elList, function() {
				this.unbind();
			});
			moveupLink.unbind();
			viewTypeBox.unbind();
			orderTypeBox.unbind();
			// add events
			if (result.current_dir_path) {
				moveupLink.click(function(e) {
					reloadPage(result.moveup_dir_path, orderTypeBox.val(), createFunc);
				});
			}
			function changeFunc() {
				if (viewTypeBox.val() == 'VIEW') {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createView);
				} else {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createList);
				}
			}
			viewTypeBox.change(changeFunc);
			orderTypeBox.change(changeFunc);
			bodyDiv.html('');
		}

		function createList(result) {
			createCommon(result, createList);
			var table = document.createElement('table');
			table.className = 'ke-table';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			bodyDiv.append(table);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i], row = K(table.insertRow(i));
				row.mouseover(function(e) {
					K(this).addClass('ke-on');
				}).mouseout(function(e) {
					K(this).removeClass('ke-on');
				});
				var img = getSvg(data.is_dir, false),
					cell0 = K(row[0].insertCell(0)).addClass(
						'ke-cell ke-name'
					).append(img).append(
						document.createTextNode(' ' + data.filename)
					).attr(
						'title', data.filename
					);
				bindEvent(cell0, result, data, createList);
				K(row[0].insertCell(1)).addClass('ke-cell ke-size').html(data.is_dir ? '-' : data.filesize);
				K(row[0].insertCell(2)).addClass('ke-cell ke-datetime').html(data.datetime);
			}
		}

		function createView(result) {
			createCommon(result, createView);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i],
					div = K('<div class="ke-inline-block ke-item"></div>'),
					photoDiv = K('<div class="ke-inline-block ke-photo"></div>').mouseover(function(e) {
						K(this).addClass('ke-on');
					}).mouseout(function(e) {
						K(this).removeClass('ke-on');
					});
				bindTitle(photoDiv, data);
				bindEvent(photoDiv, result, data, createView);
				div.append(
					photoDiv.append(getFilePreview(result, data))
				).append(
					'<div class="ke-name" title="' + data.filename + '">' + data.filename + '</div>'
				).appendTo(bodyDiv)
			}
		}
		viewTypeBox.val(viewType);
		reloadPage('', orderTypeBox.val(), viewType == 'VIEW' ? createView : createList);
		return dialog;
	}
});
