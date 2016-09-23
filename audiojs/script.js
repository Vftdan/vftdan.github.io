try{
var ac=new AudioContext();
var i;
/*for(i in ac){
alert(i+":"+a[i]);
}*/
with(ac){
var dishz=22050,lt=2;
var b=createBuffer(2,dishz*lt,dishz);
var a=new Float32Array;
/*for(i=0;i<88200;i++){
a[i]=(Math.random()*2-1);
}*/
/*
  for (var channel = 0; channel <2; channel++) {
   // This gives us the actual ArrayBuffer that contains the data
   var nowBuffering = b.getChannelData(channel);
   for (var i = 0; i < 44100; i++) {
     // Math.random() is in [0; 1.0]
     // audio needs to be in [-1.0; 1.0]
     nowBuffering[i] = Math.sin(i*(44100-i) -10000)// *(i%1000-100)/1000;
   }
  }
*/
var eardistdelay=0.010735;//sec
function numarr(n,l){
if(n.length){return (n.length==l)?n:numarr(n[0],l)};
var i,a=[];
for(i=0;i<l;i++){
a[i]=n;
};
return a;
};
function toNotNeg(i){
return Math.max(0,i);
}
var write2d=(function(){
var chs=[b.getChannelData(0),b.getChannelData(1)]

return function(t,a,p,edd){
var i;
var l=a.length||p.length;
a=numarr(a,l);
p=numarr(p,l);
var ticedd=0;
if(edd){ticedd=dishz*eardistdelay};
for(i=0;i<l;i++){
chs[0][Math.round(t+i+ticedd*(1-p[i]))]+=a[i]*toNotNeg(p[i]);
chs[1][Math.round(t+i+ticedd*p[i])]+=a[i]*toNotNeg(1-p[i]);
}
};
})();
for(i=0;i<dishz*lt;i++){
write2d(i,[Math.sin(i/10)],0.5+Math.cos(i/1000)/2);
write2d(i,[Math.cos(i/23)],0.5+Math.cos(i/3300)/2,1);
}
b.copyToChannel(a,1);
document.lastChild.onclick=function(){

var sn=createBufferSource();
sn.buffer=b;
sn.connect(destination);
sn.start(0);
alet(sn)
}

//alert(b.duration);
}
//alert(1<<30)
//alert(Math.round(Math.random()*(1<<32)));
}catch(e){alert(e)}
