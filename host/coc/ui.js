(function(){
window.onscroll=function (){var i;for(i in $UI.scrolled){($UI.scrolled[i])()}};
window["$UI"]={
open:function (e,m){
var t=e.getAttribute("ui");
t+=" @opened";
e.setAttribute("ui",t);
if(m){$UI.scrolled.push(function (){$UI.close(e)});window.parent.$UI.scrolled.push(function (){$UI.close(e)})};

},
close:function (e){
var t=e.getAttribute("ui");
t="@closed";
e.setAttribute("ui",t);
},
scrolled:[]
};
//alert ([window.parent/*,window.parent.contentWindow*/]);

})()
