/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

// Baidu Maps: http://dev.baidu.com/wiki/map/index.php?title=%E9%A6%96%E9%A1%B5

KindEditor.plugin('baidumap', function(K) {
	var self = this, 
		name = 'baidumap', 
		lang = self.lang(name + '.'),
		mapWidth = K.undef(self.mapWidth, 558),
		mapHeight = K.undef(self.mapHeight, 360),
		mapHtml = K.undef(self.mapHtml, self.pluginsPath + 'baidumap/index.html');

	// 将 map.html 转移到 js 中, 减少一个 html 文件部署
    function getMapHtml() {
        return `<html>
            <head>
                <meta charset="utf-8" /><title></title>
                <style>html,body {width:100%;height:100%;margin:0;padding:0;background:#FFF }</style>
				<link rel="stylesheet" type="text/css" href="http://api.map.baidu.com/res/13/bmap.css"/>
                <script type="text/javascript" src="http://api.map.baidu.com/getscript?v=1.3&ak=&services=&t=20200103072755"></script>
				<script>var map,geocoder;function initialize(){map=new BMap.Map("map_canvas");var a=new BMap.Point(121.473704,31.230393);map.centerAndZoom(a,11),map.addControl(new BMap.NavigationControl),map.enableScrollWheelZoom(),(new BMap.Geocoder).getLocation(a,function(a){var e=[a.addressComponents.city].join("");parent.document.getElementById("kindeditor_plugin_map_address").value=e})}function search(a){map&&new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:!0,selectFirstResult:!1}}).search(a)}</script>
            </head>
            <body onload="initialize();">
                <div id="map_canvas" style="width:100%; height:100%"></div>
            </body>
        </html>`;
	}
	
	self.clickToolbar(name, function() {
		var html = 
		`<div style="padding:10px 20px;">
			<div class="ke-header">
				<div class="ke-left">
					${lang.address} <input type="text" id="kindeditor_plugin_map_address" name="address" value="" style="width:200px;margin-right:4px" />
					<span class="ke-button-outer">
						<button name="searchBtn" class="ke-button">${lang.search}</button>
					</span>
				</div>
				<div class="ke-right" style="margin-top:6px">
					<input type="checkbox" id="keInsertDynamicMap" name="insertDynamicMap" value="1" /> 
					<label for="keInsertDynamicMap">${lang.insertDynamicMap}</label>
				</div>
				<div class="ke-clearfix"></div>
			</div>
			<div class="ke-map" style="width:${mapWidth}px;height:${mapHeight}px;"></div>
		</div>`;

		var dialog = self.createDialog({
			name : name,
			width : mapWidth + 42,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var map = win.map;
					var centerObj = map.getCenter();
					var center = centerObj.lng + ',' + centerObj.lat;
					var zoom = map.getZoom();
					var url = [checkbox[0].checked ? mapHtml : 'http://api.map.baidu.com/staticimage',
						'?center=' + encodeURIComponent(center),
						'&zoom=' + encodeURIComponent(zoom),
						'&width=' + mapWidth,
						'&height=' + mapHeight,
						'&markers=' + encodeURIComponent(center),
						'&markerStyles=' + encodeURIComponent('l,A')].join('');
					if (checkbox[0].checked) {
						self.insertHtml('<iframe src="' + url + '" frameborder="0" style="width:' + (mapWidth + 2) + 'px;height:' + (mapHeight + 2) + 'px;"></iframe>');
					} else {
						self.exec('insertimage', url);
					}
					self.hideDialog().focus();
				}
			},
			beforeRemove : function() {
				if (doc) {
					doc.write('');
				}
				iframe.remove();
				addressBox.unbind();
				searchBtn.unbind();
			}
		});

		var div = dialog.div,
			addressBox = K('[name="address"]', div),
			searchBtn = K('[name="searchBtn"]', div),
			checkbox = K('[name="insertDynamicMap"]', dialog.div),
			srcScript = 'document.open();document.close();',
			iframeSrc = K._IE ? ' src="javascript:void(function(){' + encodeURIComponent(srcScript) + '}())"' : '',
			iframe = K('<iframe class="ke-textarea" frameborder="0" style="width:100%;height:100%"' + iframeSrc + '></iframe>'),
			win, doc;

		function ready() {
			win = iframe[0].contentWindow;
			doc = K.iframeDoc(iframe);
		}
		function search(){
			if (win) {
				win.search(addressBox.val());
			}
		}
		iframe.bind('load', function() {
			iframe.unbind('load');
			if (K.IE) {
				ready();
			} else {
				setTimeout(ready, 0);
			}
		});
		// search map
		searchBtn.click(search);
		addressBox.bind('keypress', function(e) {
			e.keyCode === 13 && search()
		})
		// set innerHtml
		K('.ke-map', div).append(iframe);
        var iframeDoc = K.iframeDoc(iframe[0]);
        iframeDoc.open();
        iframeDoc.write(getMapHtml());
		iframeDoc.close();
	});
});
