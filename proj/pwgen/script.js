
function pwgen(pass,site,n){
n=n||0;
var a=pass+site+pass;
a=a.toUpperCase().split("");
var l=a.length;
var i,c,s=[];
for(i=0;i<l;i++){c=a[i].charCodeAt()-64;if(c<1||c>26){continue}; s.push(c+i*n)};
s.push(l*(n+1));
var ol=Math.abs(s.length-l)+8;
var p="";
for(i=0;i<ol;i++){
p+=gens[((s[i%s.length])+(s[(i*(n+1)+l+l+ol)%s.length]))%64];
}
return p;
}
var gens=("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890()").split("");


//document.write(pwgen(prompt("Старый пароль/семя генерации"),prompt("Название сайта"),prompt("Номер аккаунта",1)*1))
