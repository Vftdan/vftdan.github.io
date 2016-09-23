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
  var load=function(){
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
};
load();
var VDZcontains=function(p){
  return el.VDZprops.indexOf(p)!=-1;

}
var VDZadd=function(p){
  if(!VDZcontains(p)){el.VDZprops.push(p)};

}
var VDZrem=function(p){
  var j,i=el.VDZprops.indexOf(p);
  if(i!=-1){
   for(j=i;j<el.VDZprops.length-1;j++){
     el.VDZprops[j]=el.VDZprops[j+1];
  }
  el.VDZprops.pop();
  }
}
var hide=function(){
  VDZadd("hidden")
  
}
var show=function(){
  VDZrem("hidden")
  
}

el.VDZcontains=VDZcontains;
el.VDZadd=VDZadd;
el.VDZrem=VDZrem;
el.show=show;
el.hide=hide;
el.save=function(){
el.setAttribute("vdz",el.VDZtype+"/ "+el.VDZprops.join(" ")+" /"+el.VDZsubtype)
};
return el;
};
var setScale=function(s){document.lastChild.style.fontSize=s+'rem'};
return {vdzSet:vdzSet,setScale:setScale};
})();
