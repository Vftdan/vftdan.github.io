try {
var JsConsole = (function(target, href, window){
var JsConsole, W, exec, tools, doc, cons, escapeHtml, escapeAttr, escapeStr, styles, appendHtml, domTree, prefix_i, prefix_o, def, i, w, evalWrap, tryToStr, toEval = [], enqueueEval, dequeueEval, spaceSplit, getFieldR, $range, docCheck, docChangeListeners = [], lastVar = '__LAST', clipCopyStr, domInsert, libAliases, trim, conInput, extKeys = true, gopn, getKeys, parseBool, npRe, npEsc, hasKeys, scopes = [];
def = [];
window.addEventListener('load', function() {
conInput = document.getElementById('coninput');
}, false);
npRe = /[\x00-\x1f\u2000-\u200f\u2028-\u202f\u205f-\u206f]/g;
npEsc = function(c){c = c.charCodeAt(0); if(c>255)return '\\u' + (0x10000 + c).toString(16).slice(1); else return '\\x' + (0x100 + c).toString(16).slice(1)};
gopn = Object.getOwnPropertyNames || Object.keys;
getKeys = function(o, depth) {
if(depth > 255) return [];
depth = depth || 0;
if(!extKeys) return Object.keys(o);
var pn = gopn(o);
ko = {};
if(o.__proto__) {
pn = pn.concat(getKeys(o.__proto__, depth + 1));
} else if(o.constructor && o.constructor.prototype) {
pn = pn.concat(getKeys(o.constructor.prototype, depth + 1));
}
var i;
for(i = 0; i < pn.length; i++) {
if(pn[i] in o) ko['@' + pn[i]] = true;
}
pn = [];
for(i in ko) {
if(i[0] == '@') pn.push(i.slice(1));
}
return pn;
};
if(!([].filter)) Array.prototype.filter = function(g) {
var a=[], i;
for(i in this) {
if((+i)==(+i)&&g(this[i])) a.push(this[i]);
};
return a;
};
hasKeys = function(s) {
s = getFieldR(W, s);
try {
Object.keys(s);
return true;
} catch(e) {
return false;
}
};
trim = function(s) {
return s.replace(/^[\s\x00-\x20]+|[\s\x00-\x20]+$/g, '');
};
parseBool = function(s) {
s = trim(s).toLowerCase();
if(s.length == 0) return null;
if('ty+'.indexOf(s[0]) + 1) return true;
if('fn-'.indexOf(s[0]) + 1) return false;
var n = +s;
if(n == n) return !!n;
return null;
};
clipCopyStr = function(s) {
var a = document.getElementById('cbbuf');
a.value = s;
a.select();
return document.execCommand('copy');
};
spaceSplit = function(s, c) {
return s.replace(/^\s+|\s+$/g, '').split(/\s+/, c);
}
$range = "(function(a, b, s){a = +a || 0; b = +b || 0; if(a == b) return []; s = +s || 1;})";
getFieldR = function(t, p) {
p = p.split('.')
while(p.length) {
t = t[p.shift()];
}
return t;
}
dequeueEval = function(ttl) {
if(toEval.length) {
ttl = +ttl || 0;
var s = toEval.shift();
try {
eval(s);
} catch(e) {
cons.error(e);
}
if(ttl) {
setTimeout(dequeueEval.bind(this, ttl - 1), 1);
}
}
}
enqueueEval = function(s, ttl) {
toEval.push(s);
if(ttl) {
dequeueEval(ttl - 1 || 0);
}
}
tryToStr = function(o) {
var s;
try {
s = (o && typeof o.toString == 'function') ? o.toString() : o + '';
} catch(e) {
s = '[Cannot convert to string, ' + (typeof o) + ']';
}
return s;
}
evalWrap = function(__COMMAND, window, denyLastVar) {
try{
var __LAST = this.eval(__COMMAND);
if(!denyLastVar && lastVar) this[lastVar] = __LAST;
return __LAST;
}catch(e){
cons.error(e);
}
}
escapeHtml = function(s) {
return (s + '').replace(/\&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;').replace(/\n/g, '<br />');
}
escapeAttr = function(s) {
return (s + '').replace(/\&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;').replace(/\"/g, '&quot;');
}
escapeStr = function(s) {
return (s + '').replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\\"').replace(npRe, npEsc);
}
domInsert = function(p, c, ind) {
var cc = p.firstChild, i;
for(i = 0; i < ind; i++) {
if(!cc) break;
cc = cc.nextSibling;
}
if(cc) return p.insertBefore(c, cc);
else return p.appendChild(c);
}
appendHtml = function(h, p) {
try {
var d = window.document.getElementById('output');
var sh = d.scrollHeight;
var w = document.createElement('div');
var wd = document.createElement('span');
var lew = document.createElement('div');
wd.innerHTML = h;
lew.setAttribute('lewrap', '');
var btns = [['addInput', function() {conInput.value += wd.innerText}], ['setInput', function() {conInput.value = wd.innerText}], ['copy', function(){clipCopyStr(wd.innerText)}]];
var i;
for(i in btns) {
var bt = document.createElement('div');
bt.setAttribute('lebtn', btns[i][0]);
bt.onclick = btns[i][1];
lew.appendChild(bt);
}
w.innerHTML = '<hr />' + (p || '');
domInsert(w, lew, 1);
w.appendChild(wd);
d.appendChild(w);
d.scrollTop += d.scrollHeight - sh;
return w;
} catch(e) {
alert(e);
}
}
domTree = function(e) {
if(!e.tagName && e.nodeType != 9) {
var s = escapeHtml(e.textContent);
if(e.nodeType == 8) {
return '<div><input type="checkbox" /><label>&lt;!-- --&gt;</label><div treespoiler>' + s + '</div></div>';
}
return s;
}
var pre, mid, pst, s, c, i, a;
pre = '<div><label><input type="checkbox" /><span>';
mid = '</span><label treespoiler>';
pst = '</label></label></div>';
s = [pre, e.nodeName];
a = e.attributes;
if(a) {
for(i = 0; i < a.length; i++) {
s.push(' ' + escapeHtml(a[i].name) + '="' + escapeHtml(escapeAttr(a[i].value)) + '"');
}
}
s.push(mid);
c = e.firstChild;
while(c) {
s.push(domTree(c));
c = c.nextSibling;
}
s.push(pst);
return s.join('');
}
prefix_i = escapeHtml('>>> ');
prefix_o = escapeHtml('<<< ');
W = window.open(href, target);
docCheck = function() {
var d = W.document;
if(d != doc) {
var o = doc;
doc = d;
var i;
for(i in docChangeListeners) {
try {
docChangeListeners[i]({'before': o, 'after': d});
} catch(e) {
if(cons && typeof cons.error == 'function') {
cons.error(e);
}
}
}
}
}
docCheck();
//doc = W.document;
tools = {
'#include': function(src) {
try {
src = trim(src);
if(src[0] == '<' && src[src.length - 1] == '>') {
if(src in libAliases) src = libAliases[src];
else throw 'Include not found';
}
W.eval("(function() {var s = document.createElement('script');s.src = '" + escapeStr(src) + "';s.setAttribute('defer', '');document.getElementsByTagName('head')[0].appendChild(s);})()");
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
s = decodeURIComponent(escape(atob(trim(s))));
appendHtml("<code style='" + styles.string.join(';') + "'>" + escapeHtml(s) + "</code>", "<button>Click to execute</button>").firstChild.nextSibling.nextSibling.addEventListener('click', function(e){
if(confirm('Execute code?')) {
var i, l = s.split('\n');
for(i in l) {
exec(l[i]);
}
}
}, false);
},
'#range': function(a) {
try {
a = spaceSplit(a);

} catch(e) {
cons.error(e);
}
},
'#inspect': function(a) {
try { 
a = spaceSplit(a);
var el;
docCheck();
if(a[0] == '@') {
a.shift();
el = doc.querySelector(a.join(' '));
} else {
el = getFieldR(W, a[0]);
}
appendHtml('<div tree style="width: 100%; overflow: auto;">' + domTree(el) + '</div>');
} catch(e) {
cons.error(e);
}
},
'#lastvar': function(a) {
try {
lastVar = spaceSplit(a)[0];
} catch(e) {
cons.error(e);
}
},
'#extkeys': function(a) {
try {
var b = parseBool(spaceSplit(a)[0]);
if(b === null) throw 'Cannot parse boolean';
extKeys = b;
} catch(e) {
cons.error(e);
}
},
'#showdoc': function(a) {
try {
var b = parseBool(spaceSplit(a)[0]);
if(b === null) throw 'Cannot parse boolean';
document.body.setAttribute('jsconsHidedoc', !b);
} catch(e) {
cons.error(e);
}
},
'#showout': function(a) {
try {
var b = parseBool(spaceSplit(a)[0]);
if(b === null) throw 'Cannot parse boolean';
document.body.setAttribute('jsconsHideout', !b);
} catch(e) {
cons.error(e);
}
},
}
exec = function(c, asVoidI, asVoidO) {
try {
if(c[0] == '@') return exec(c.substr(1), true, asVoidO);
if(!asVoidI) appendHtml(escapeHtml(c), prefix_i);
if(c[0] == '#') {
try{
var kv = [].slice.call(c.match(/^(\#\w*)\s*(.*)$/), 1);
} catch(e) {
cons.error('Cannot parse: ' + c);
return;
}
kv[0] = kv[0].toLowerCase();
if(tools[kv[0]]) {
try {
tools[kv[0]](kv[1]);
} catch(e) {
cons.error(e);
}
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
var ret = evalWrap.call(W, c, W);
if(!asVoidO) cons.dir(ret);
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
if(!((typeof o) in {'object': null, 'function': null}) || o === null || tryToStr(o).match(/\[Cannot\sconvert\sto\sstring\,\s\w*\]/)) return this.log(o); 
var t, r, i, k, s = '{';
k = getKeys(o);
for(i = 0; i < k.length; i++) {
try {
r = o[k[i]];
t = r === null ? 'null' : typeof r;
r = '<span style="' + styles[t].join(';') + '">' + escapeHtml(tryToStr(r)) + '</span>';
s += '<br />"' + escapeHtml(escapeStr(k[i])) + '": ' + r + ',';
} catch(e) {
r = '<span style="' + styles.undefined.join(';') + '">Cannot access</span>';
s += '<br />"' + escapeHtml(escapeStr(k[i])) + '": ' + r + ',';
}
}
s += '<br />}';
if(typeof o == 'function') s = '<span style="' + styles.function.join(';') + '">' + escapeHtml(tryToStr(o)) + '</span><br />' + s
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
/*W.addEventListener('load', function() {
try {
var w = document.getElementByName(target).contentWindow, i;
for(i in cons) {
w.__mutateObject ("console." + i, cons[i]);
}
} catch(e) {
cons.error(e);
}}, false);*/
styles = {
'object': ['color: #5555dd'],
'number': ['color: #3333ff'],
'boolean': ['color: #882222'],
'string': ['color: #22dd22'],
'undefined': ['color: #888888'],
'null': ['color: #880088'],
'function': ['color: #ff8822'],
'symbol': ['color: #557788'],
}
libAliases = {
'<preplacer>': './preplacer.js',
'<jquery>': 'https://code.jquery.com/jquery.min.js',
'<js3>': '/proj/js3/lib.js',
'<vk>': 'https://vk.com/js/api/openapi.js',
'<dummyneko>': 'https://b1nary.tk/dummyneko.js',
'<petooh>': 'http://ky6uk.github.io/PETOOH/js/petooh.min.js',
'<polyfill>': 'https://cdn.polyfill.io/v2/polyfill.min.js',
}
if(window.name.match(/^fXD.{5}$/)) window.addEventListener('load', function(){
exec("var __msgProceedFunc = null; parent.onmessage = function(e){try{if(__msgProceedFunc) __msgProceedFunc(e);if(e.origin == 'https://vk.com') return fastXDM.onMessage(e); return parent.parent.postMessage(e.data, '*')}catch(ex){console.error(ex)}};", true, true);
}, false);
JsConsole = {
W: W
,exec: exec
,styles: styles
,cons: cons
,escapeStr: escapeStr
,enqueueEval: enqueueEval
//,tools: tools
};
//W.eval("window.addEventListener('load', function(){var init = VK.init; VK.init = function(){init.call(this, [].slice.call(arguments, 0)); VK._Rpc = top;}}, false)");
//exec('#include data:text/javascript;utf8,window.console.error(window.document.write(1))');
//doc.write(1);
return JsConsole;
})('targetifr', 'frame.html' + location.search, window);
if(location.search && location.search.match(/(?:[\?\&])hash\=([^\&]+)/)) window.addEventListener('load', function(){JsConsole.exec('#runbase64 ' + decodeURIComponent(location.search.match(/(?:[\?\&])hash\=([^\&]+)/)[1]), true)}, false);
window.beforeunload = window.onbeforeunload = function(e) {
var s = 'Leave?';
e.returnValue = s;
if(confirm(s)) e.preventDefault();
return s;
}
throw '';
} catch(e) {
document.getElementById('output').innerHTML = e;
}