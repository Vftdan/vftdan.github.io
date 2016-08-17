
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
function go(e){
try{
e.preventDefault();
var p=trim(ge("p").value);
var h=trim(ge("h").value);
window.open(ism?(byp?("https://m.vk.com/"+p+"?q=%23"+h):("https://m.vk.com/feed?section=search&q=%23"+h)):(byp?(function(){throw "В полной версии поиск по странице не поддерживается!"}()):("https://vk.com/feed?c%5Bq%5D=%23"+h+"&section=search")))
}catch(e){alert(e)}
}
function trim(a){
a=a.split("");
var i;
for(i in a){if(a[i].match(/[\n\t ]/))a[i]=""};
return a.join("");
}
