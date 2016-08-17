/*window.addEventListener('load', function(e) {
  document.querySelector('#test').innerHTML = 'app1';
}, false);*/
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
e.preventDefault();
var p=ge("p").value;
var h=ge("h").value;
window.open(byp?("https://vk.com/"+p+"?q=%23"+h):("https://vk.com/feed?section=search&q=%23"+h))
}
var hex="0123456789ABCDEF".split("");
function norm(s){
s=s.split("");
var i,c,c1,c2;
for(i in s){
c=s[i].charCodeAt();
if(c>255){
c1=div(c,256);
c2=c%256;
s[i]=hexc(c1)+hexc(c2);
}else{
s[i]=hexc(c);
}
}
s=s.join("");
return s;
}
function div(i,j){
return (i-(i%j))/j;
}
function hexc(a){
return "%"+hex[div(a,16)]+hex[a%16];
}
