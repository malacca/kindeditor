KindEditor.plugin("emoticons",function(e){var i=this,s=0,n=i.emoticonsPath||i.pluginsPath+"emoticons/images/",t=[{name:"QQ表情",preview:void 0===i.allowPreviewEmoticons||i.allowPreviewEmoticons,baseUrl:n,rows:10,lists:[[0,134,".gif"]],insertCell:function(e,i){return'<span class="ke-qqimg" style="background-image:url('+n+"static.png);background-position:-"+24*i+'px 0px"></span>'},insertEditor:function(e,i){return'<img src="'+e+'" class="emoji_qq"/>'}},{name:"Emoji",rows:10,lists:"😃 😁 😆 😅 😂 😉 😍 😘 😝 😏 😪 😷 😵 😎 😳 😢 😭 😡 💪 👊 👍 👎 👌 👏 👈 👉 👆 👇 🙏 👀 👃 👂 👄 🍚 🍜 🍝 🍧 🎂 🍳 🍟 🍔 🍺 ☕ 🍎 🍓 🍌 🍉 💰 💯 🏃 🐒 🌹 🍭 🚑 ⏰ 🌙 🌟 ⛅ ☂ ⛄ 🔥 🏆 ⚽ 🏀 🎯 💄 ☎ 📙 🚹 🚺".split(" "),insertCell:function(e,i){return"<span>"+e+"</span>"},insertEditor:function(e,i){return e}}];function o(s,n,t,o){if(s.click(function(e){var s=n.insertEditor?n.insertEditor(t,o):'<img src="'+t+'" />';i.insertHtml(s).hideMenu().focus(),e.stop()}),n.preview){var r,l,a,c=s.first(),d=function(e){l&&(e&&a?(c.hide(),r.show()):e||a||(c.show(),r.hide()))};s.mouseenter(function(){a=!0,l?d(!0):r||(r=e('<img src="'+t+'" />').hide().bind("load",function(){l=!0,d(!0)}).appendTo(s))}).mouseleave(function(){a=!1,d(!1)})}}i.clickToolbar("emoticons",function(){var n,r,l,a,c,d,u,m=[],f=t.length,p=[];for(r=e('<div class="ke-plugin-emoticons"></div>'),u='<div class="ke-em-group">',n=0;n<f;n++)p[n]=!1,u+='<div class="ke-em-list"></div>';for(u+="</div>",r.html(u),l=e("<div></div>").appendTo(r),c=r.first(),d=c.children(),a=e.tabs({src:l,addClass:"ke-em-tab",afterSelect:function(i){s=i,p[i]||(p[i]=!0,e(d[i]).append(function(i,s){var n,r,l,a,c,d,u,m,f,p;for(r=[],l=(n=t[s]).lists.length,a=0;a<l;a++)if(e.isArray(n.lists[a]))for(d=n.lists[a].length,c=n.lists[a][0];c<=n.lists[a][1];c++)r.push((d>3?n.lists[a][3]:"")+""+c+(d>2?n.lists[a][2]:""));else r.push(n.lists[a]);for(l=r.length,m=Math.ceil(l/n.rows),(u=document.createElement("table")).className="ke-em-table ke-em-table"+s,u.cellPadding=0,u.cellSpacing=0,u.border=0,a=0;a<m;a++)for(row=u.insertRow(a),c=0;c<n.rows;c++)f=e(row.insertCell(c)),(d=n.rows*a+c)<l&&(p=(n.baseUrl?n.baseUrl:"")+r[d],f.attr({src:p,index:d}).append(n.insertCell?n.insertCell(p,d):'<img src="'+p+'" />'),i.push(f),o(f,n,p,d));return u}(m,i)))}}),n=0;n<f;n++)a.add({title:t[n].name,panel:d[n]});var v=i.createMenu({name:"emoticons",addClass:"ke-menu-clear",beforeRemove:function(){e.each(m,function(){this.unbind()})}});v.div.append(r),v.autoLeft(),a.select(s)})});