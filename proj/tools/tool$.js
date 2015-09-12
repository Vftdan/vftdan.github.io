var tool$={
dom:function(a,b){
if(!b){var b=0};
a=a.split("");var p=a.shift();var e;c:{
if(p=="."){e=document.getElementsByClassName(a.join(""))[b];break c};
if(p=="#"){e=document.getElementById(a.join(""));break c};
e=document.getElementsByTagName(p+a.join(""))[b]
};
addDomFx(e);
return e
},

}
