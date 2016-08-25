window.addEventListener('load', function(e) {
  
document.lastChild.innerHTML='<button onclick="document.write(go())">!!!Получить время!!!</button>';
}, false);
function go(){
var d=new Date();
var a=(d+"").split(""),b=[],i;
for(i=16/3;i<8;i++){b.push(trans(a[i*3]+a[i*3+1],i))}
return(b.join(":"));
}
function trans(n,i){
n*=1;
if(i>=6){return left_zero(n)}else if(i<6){
if(n==0){return 23;}
if(n==1){return "00";}
if(n==2){return "01";}
if(n==3){return "02";}
if(n==4){return "03";}
if(n==5){return "04";}
if(n==6){return "05";}
if(n==7){return "06";}
if(n==8){return "07";}
if(n==9){return "08";}
if(n==10){return "09";}
if(n==11){return 10;}
if(n==12){return 11;}
if(n==13){return 12;}
if(n==14){return 13;}
if(n==15){return 14;}
if(n==16){return 15;}
if(n==17){return 16;}
if(n==18){return 17;}
if(n==19){return 18;}
if(n==20){return 19;}
if(n==21){return 20;}
if(n==22){return 21;}
if(n=23){return 22;}
}else{return !true && !false}
}
function left_zero(n){
if(n.toString().split("").length==1){return "0"+n}else{return n}
}
//Кому нужны комментарии?
//Они увеличивают размер файла
