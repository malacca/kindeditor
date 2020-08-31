/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-${THISYEAR} kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @website http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
* @version ${VERSION}
*******************************************************************************/

(function(g,n,f){
	typeof exports==='object'&&typeof module!=='undefined'
		? module.exports=f(n)
		: typeof define==='function'&&define.amd
			? define(function(){return f(n)})
			: ( g=g||self, !g.KindEditor && (g.KindEditor=f(n)) );
}(this, document.currentScript, (function(currentScript) {