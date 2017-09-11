var Turing = (function(){
var Line, Program, encode, decode, Turing;
Line = function(o0, d0, g0, o1, d1, g1) {
g0 = g0 | 0;
if(g0) this.goto_0 = g0;
g1 = g1 | 0;
if(g1) this.goto_1 = g1;
if(g0 < 0 || g1 < 0) throw 'negative line pointer';
d0 = +d0;
if(d0) {
if(d0 < 0) {this.dataShift_0 = -1} else {this.dataShift_0 = 1};
}
d1 = +d1;
if(d1) {
if(d1 < 0) {this.dataShift_1 = -1} else {this.dataShift_1 = 1};
}
this.out_0 = !!o0;
this.out_1 = !!o1;
}
Line.prototype = {
goto_0: 0,
dataShift_0: 0,
out_0: false,
goto_1: 0,
dataShift_1: 0,
out_1: true
}
encode = function(a) {
var b = [], i, j;
for(i = 0; i < a.length; i++) {
for(j = 0; j <= a[i]; j++) {
b.push(true);
}
b.push(false);
}
return b;
}
decode = function(b) {
var a = [], i, j = -1;
while(b.length && !b[0]) b.shift();
for(i = 0; ; i++) {
if(!b[i]) {
if(j + 1) {
a.push(j);
j = -1;
} else {
return a;
}
} else {
j++;
}
}
}

Program = function() {
this.lines = [];
}
Program.prototype = {
lines: null,
data: null,
dataPtr: 0,
linePtr: 1,
leftPad: function(n) {
if(n === undefined) n = 1;
var i;
for(i = 0; i < n; i++) {
this.data.unshift(false);
this.dataPtr++;
}
},
setData: function(data) {
if(data.slice) {
data = data.slice(0);
} else {
[].slice.apply(data, [0]);
}
this.data = data;
},
bindLines: function(l) {
this.lines = l;
},
setLine: function(i, l) {
this.lines[i - 1] = l;
},
step: function() {
if(!this.linePtr) return true;
var o, d, g, val = this.data[this.dataPtr], line = this.lines[this.linePtr - 1];
if(!line) throw 'line #' + this.linePtr + ' not exists, line count: ' + this.lines.length;
if(val) {
o = line.out_1;
d = line.dataShift_1;
g = line.goto_1;
} else {
o = line.out_0;
d = line.dataShift_0;
g = line.goto_0;
}
if(this.dataPtr + d < 0) this.leftPad(-this.dataPtr - d);
this.data[this.dataPtr] = o;
this.dataPtr += d;
this.linePtr = g;
return false;
},
execute: function() {
this.lines = this.lines || [];
this.data = this.data || [];
while(!this.step()) {}
}
};

Turing = {
Line: Line,
Program: Program,
encode: encode,
decode: decode,
LEFT: -1,
RIGHT: 1,
SAME: 0,
EXIT: 0
};
return Turing;
})()