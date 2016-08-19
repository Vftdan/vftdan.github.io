
ism=false;
var byp=0;
function chsp(id){
var s=ge(id);
var a=!(s.getAttribute("o")*1)*1;
s.setAttribute("o",a);
if(id=="s")byp=a;
}
function ge(id){
return document.getElementById(id);
}
function message(a) {
if(a&&a!=""){alert(a)};
}
function go(e){
try{
e.preventDefault();
var p=trim(ge("p").value);
var h=trim(ge("h").value);
window.open(ism?(byp?("https://m.vk.com/"+p+"?q=%23"+h):("https://m.vk.com/feed?section=search&q=%23"+h+"&_ff=1")):(byp?(deskbyp(p,h)):("https://vk.com/feed?c%5Bq%5D=%23"+h+"&section=search")))
}catch(e){alert(e)}
}
function trim(a){
a=a.split("");
var i;
for(i in a){if(a[i].match(/[\n\t ]/))a[i]="";if(a[i]=="/")a[i]="%2F"};
return a.join("");
}
function deskbyp(){
throw "В полной версии поиск по странице не поддерживается, установите флажок «Мобильная версия»"
}

window.addEventListener('load',(function(){if(window.parent&&window.parent!=window){VK.init(function(){ge("vkb").setAttribute("o",1);
},function(){alert(-1)},"5.53");deskbyp=function(p,h){VK.api("utils.resolveScreenName",{screen_name:p},function(w){message(w);window.open("https://vk.com/wall"+w.object_id+"?q=%23"+h)});throw ""}}}),false);

function addtomenu(){
VK.callMethod("showSettingsBox", 256);
VK.api("account.setNameInMenu",{},function(){});
}
