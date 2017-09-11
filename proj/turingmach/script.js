try{
(function(){
with(Turing) {
var p = new Program(), l = [], d = [];
//Program: true seq to zero
/*l = [
new Line(0, SAME, 0, 0, RIGHT, 1)
];
d = [false, true, true, true];
//*/

//Program: sum
l = [
new Line(0, SAME, 0, 0, RIGHT, 2),
new Line(0, RIGHT, 1, 0, RIGHT, 3),
new Line(1, RIGHT, 4, 1, RIGHT, 3),
new Line(1, RIGHT, 0, 1, LEFT, 5),
new Line(0, RIGHT, 1, 1, LEFT, 5)
];
d = encode([1, 0, 5, 0, 2, 1]);
//*/
p.bindLines(l);
p.setData(d);
p.execute();
document.write(decode(d) + '<br />' + decode(p.data));
}
})()
} catch(e) {
document.write(e);
}