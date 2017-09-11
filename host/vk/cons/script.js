try {
var JsConsole = (function(target, href, window){
var JsConsole, W, exec, tools, doc, cons, escapeHtml, styles, appendHtml, prefix_i, prefix_o, def, i, w, evalWrap, tryToStr;
def = [];
tryToStr = function(o) {
var s;
try {
s = o + '';
} catch(e) {
s = '[Access denied, ' + (typeof o) + ']';
}
return s;
}
evalWrap = function(s, window) {
try{
with(this) {
var a = this.eval(s);
return a;
}
}catch(e){
cons.error(e);
}
}
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
try {
var s = doc.createElement('script');
s.src = src;
s.setAttribute('defer', '');
doc.lastChild.appendChild(s);
} catch(e) {
cons.error(e);
}
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
a = s.match(/^([\w_\$]+)\s+(.*)$/);
if(!a) {
cons.error('Wrong arguments');
return;
}
def.push([new RegExp('([^\\w_\\$])' + a[1] + '(?![\\w_\\$])', ''), '$1' + a[2].replace(/\$/g, '$$$$')]);
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
cons.error('Cannot parse: ' + c);
return;
}
kv[0] = kv[0].toLowerCase();
if(tools[kv[0]]) {
tools[kv[0]](kv[1]);
} else {
cons.error('Unknown command: ' + kv[0]);
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
cons.dir(evalWrap.call(W, c, W));
}
} catch(e) {
cons.error(e);
}
}
cons = {
'error': function(s) {
appendHtml('<span style="color: #ff2222">' + escapeHtml(tryToStr(s)) + '</span>', prefix_o);
},
'log': function(r) {
var t = r === null ? 'null' : typeof r;
r = '<span style="' + styles[t].join(';') + '">' + escapeHtml(tryToStr(r)) + '</span>';
appendHtml(r, prefix_o);
},
'dir': function(o) {
if((typeof o) != 'object' || o === null || tryToStr(o) == '[Access denied, object]') return this.log(o); 
var t, r, i, s = '{';
for(i in o) {
r = o[i];
t = r === null ? 'null' : typeof r;
r = '<span style="' + styles[t].join(';') + '">' + escapeHtml(tryToStr(r)) + '</span>';
s += '<br />"' + escapeHtml(i.replace(/\"/g, "\\\"")) + '": ' + r + ',';
}
s += '<br />}';
appendHtml(s, prefix_o);
}
}
/*w = {
console: cons,
document: doc,
}
w.window = w;
for(i in W) {
if(!(i in w)) w[i] = W[i];
}
w.eval = W.eval;
W._window = w;*/
W.name = window.name;
W.addEventListener('load', function() {
try {
var w = document.getElementByName(target).contentWindow, i;
for(i in cons) {
w.__mutateObject ("console." + i, cons[i]);
}
} catch(e) {
cons.error(e);
}}, false);
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
//W.eval("window.addEventListener('load', function(){var init = VK.init; VK.init = function(){init.call(this, [].slice.call(arguments, 0)); VK._Rpc = top;}}, false)");
//exec('#include data:text/javascript;utf8,window.console.error(window.document.write(1))');
//doc.write(1);
return JsConsole;
})('targetifr', 'frame.html' + location.search, window);
if(location.search && location.search.match(/(?:[\?\&])hash\=([^\&]+)/)) window.addEventListener('load', function(){JsConsole.exec('#runbase64 ' + decodeURI(location.search.match(/(?:[\?\&])hash\=([^\&]+)/)[1]))}, false);
throw '';
} catch(e) {
document.getElementById('output').innerHTML = e;
}