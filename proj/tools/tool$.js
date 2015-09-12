var tool$={
dom:function(a,b){
if(!b){var b=0};
a=a.split("");var p=a.shift();var e;c:{
if(p=="."){e=document.getElementsByClassName(a.join(""))[b];break c};
if(p=="#"){e=document.getElementById(a.join(""));break c};
e=document.getElementsByTagName(p+a.join(""))[b]
};
tool$.addDomFx(e);
return e
},
addDomFx:function(e){
e["css"]=function(a,b){a+="";a=a.split("");var i;
for(i=0;i<a.length;i++){if(a[i]=="-"){a[i+1]=a[i+1].toUpperCase();a[i]=""}};
a=a.join("");
this.style[a]=b;
return this};
e["cont"]=function(t){this.innerHTML=t;return this};
e["contBefore"]=function(t){this.cont(t+this.innerHTML);return this};
e["contAfter"]=function(t){this.cont(this.innerHTML+t);return this};}
}
