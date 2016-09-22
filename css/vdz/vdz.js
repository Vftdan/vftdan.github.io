var VDZ=(function(){
function last(a){
return a[a.length-1];
}
function remfirst(s){
var a=s.split("");
a.shift();
return a.join("");
}
function remlast(s){
var a=s.split("");
a.pop();
return a.join("");
}
var crElem=function(t){
var el=document.createElement(t);
return el;
};
var vdzSet=function(el){
el.load=function(){
var a=el.getAttribute("vdz");

var VDZtype="",VDZprops=[],VDZsubtype="";
if(a){a=a.split(" ");
if(a.length==1){a=a[0].split("/");VDZtype=a[0];VDZsubtype=a[1]}else{
if(last(a[0].split(""))=="/"){VDZtype=remlast(a[0])};
if(last(a).split("")[0]=="/"){VDZsubtype=remfirst(last(a))};};
a.pop();
a.shift();
VDZprops=a;
};
el.VDZtype=VDZtype;
el.VDZprops=VDZprops;
el.VDZsubtype=VDZsubtype;
}
el.load();
el.save=function(){
el.setAttribute("vdz",el.VDZtype+"/ "+el.VDZprops.join(" ")+" /"+el.VDZsubtype)
};
return el;
};

return {vdzSet:vdzSet};
})();