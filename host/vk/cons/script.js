try {
var JsConsole = (function(target, href, window){
var JsConsole, W, exec, tools, doc, cons, escapeHtml, styles, appendHtml, prefix_i, prefix_o, def, i, w;
def = [];
escapeHtml = function(s) {
return (s + '').replace(/\&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;').replace(/\n/g, '<br />');
}
appendHtml = function(h, p) {
window.document.getElementById('output').innerHTML += '<hr />' + (p || '') + h;
}
prefix_i = escapeHtml('>>> ');
prefix_o = escapeHtml('<<< ');
W = window.open(href, target);
doc = W.document;
tools = {
'#include': function(src) {
var s = doc.createElement('script');
s.src = src;
s.setAttribute('defer', '');
doc.lastChild.appendChild(s);
},
'#prefixi': function(s) {
prefix_i = escapeHtml(s);
},
'#prefixo': function(s) {
prefix_o = escapeHtml(s);
},
'#htmlprefixi': function(s) {
prefix_i = s;
},
'#htmlprefixo': function(s) {
prefix_o = s;
},
'#addstyle': function(s) {
var a, b, c, i;
a = s.match(/^(\w+)\s+(.*)$/);
if(!a) return;
if(a[1] in styles) {
b = styles[a[1]];
c = a[2].split(';');
for(i in c) {
b.push(c[i]);
}
//cons.log('Style added');
}
},
'#bg': function(s) {
document.body.style.background = s;
//cons.log('Background set');
},
'#color': function(s) {
document.body.style.color = s;
//cons.log('Color set');
},
'#cls': function() {
window.document.getElementById('output').innerHTML = '';
},
'#define' : function(s) {
var a;
a = s.match(/^([\w_]+)\s+(.*)$/);
if(!a) {
cons.err('Wrong arguments');
return;
}
def.push([new RegExp('([^\\w_])' + a[1] + '(?![\\w_])', ''), '$1' + a[2].replace(/\$/g, '$$$$')]);
},
'#runbase64': function(s) {
s = atob(s).split('\n');
var i;
for(i in s) {
exec(s[i]);
}
}
}
exec = function(c) {
try {
appendHtml(escapeHtml(c), prefix_i);
if(c[0] == '#') {
try{
var kv = [].slice.call(c.match(/^(\#\w*)\s*(.*)$/), 1);
} catch(e) {
cons.err('Cannot parse: ' + c);
return;
}
kv[0] = kv[0].toLowerCase();
if(tools[kv[0]]) {
tools[kv[0]](kv[1]);
} else {
cons.err('Unknown command: ' + kv[0]);
}
} else {
var i;
if(c.replace(/^\s*/, '')[0] == '{') {
c = '(' + c + ')';
} else {
c = ' ' + c + ' ';
}
for(i in def) {
c = c.replace(def[i][0], def[i][1]);
}
cons.dir(w.eval(c));
}
} catch(e) {
cons.err(e);
}
}
cons = {
'err': function(s) {
appendHtml('<span style="color: #ff2222">' + escapeHtml(s) + '</span>', prefix_o);
},
'log': function(r) {
var t = r === null ? 'null' : typeof r;
r = '<span style="' + styles[t].join(';') + '">' + escapeHtml(r) + '</span>';
appendHtml(r, prefix_o);
},
'dir': function(o) {
if((typeof o) != 'object' || o === null) return this.log(o); 
var t, r, i, s = '{';
for(i in o) {
r = o[i];
t = r === null ? 'null' : typeof r;
r = '<span style="' + styles[t].join(';') + '">' + escapeHtml(r) + '</span>';
s += '<br />"' + escapeHtml(i.replace(/\"/g, "\\\"")) + '": ' + r + ',';
}
s += '<br />}';
appendHtml(s, prefix_o);
}
}
w = {
console: cons,
document: doc,
}
w.window = w;
for(i in W) {
if(!(i in w)) w[i] = W[i];
}
w.eval = W.eval;
W._window = w;
styles = {
'object': ['color: #2222ff'],
'number': ['color: #0000ff'],
'boolean': ['color: #882222'],
'string': ['color: #22dd22'],
'undefined': ['color: #888888'],
'null': ['color: #880088'],
'function': ['color: #ff8822']
}
JsConsole = {
W: W,
exec: exec,
styles: styles
};
//exec('#include data:text/javascript;utf8,window.console.err(window.document.write(1))');
//doc.write(1);
return JsConsole;
})('targetifr', 'frame.html' + location.search, window);
if(location.search && location.search.match(/(?:[\?\&])hash\=([^\&]*)/)) JsConsole.exec('#runbase64 ' + decodeURI(location.search.match(/(?:[\?\&])hash\=([^\&]*)/)[1]));
throw '';
} catch(e) {
document.getElementById('output').innerHTML = e;
}