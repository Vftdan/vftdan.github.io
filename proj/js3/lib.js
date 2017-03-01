try {
//alert(0)
new (function(libName){
var copyFunc = function(scope, func){
return function(){return func.apply(scope, arguments)};
}
var lib = this;
var Graphics = {dim2:{}, dim3:{}};
var Vectors;
var compFloat;
var PI = Math.acos(-1);
var DEG = PI / 180;
var getView;
var R = {values:{}, colors:{}};
var baseView = {};
var withProto;
var View;
this.compFloatBits = 16;
compFloat = function(a, b) {var m = 1 << lib.compFloatBits; a = Math.round(a*m)/m; b = Math.round(b*m)/m; return a == b}
View = function(el, opt){
if(!(this instanceof View)) return new View(el, opt);
var TN, i, ID, par, parv;
if(!(el||opt)) return this;
if(!el||el.constructor==Object){
opt=opt||el;
TN = opt.tagName.toUpperCase();
ID = opt.id;
par = opt.parent || opt.parentView.element;
parv = getView(par);
this.parent = par;
this.parentView = parv;
el = document.createElement(TN);
this.element = el;
this.tagName = TN;
this.id = ID;
el.VIEW = this;
if(el.constructor == HTMLDocument) this.parentView = baseView;
return this;
}
if(!opt&&el.constructor!=Object){
return new View(el, {});
/*TN = el.tagName.toUpperCase();
ID = el.id || el.getAttribute("id");
//alert([el,el.parentNode])
par = el.parentNode;
parv = getView(parv);
this.parent = par;
this.parentView = parv;
el.VIEW = this;
this.element = el;
this.tagName = TN;
this.id = ID;
return this;*/
}
TN = (el.tagName || "{NONE}").toUpperCase();

ID = el.id || (el.getAttribute && el.getAttribute("id")) || "";
par = el.parentNode;
parv = getView(par);
//alert([par, parv, View(document)])
this.parent = par;
this.parentView = parv;
el.VIEW = this;
this.tagName = TN;
this.id = ID;
if(el.constructor == HTMLDocument) this.parentView = baseView;
};
View.prototype = {
parent:document.body,
parentView:null,
element:null,
id:"",
tagName:"",
setStyle:function(k, v){
var s = k.split(''), i;
for(i=0;i<s.length;i++){
if(s[i] == '-') {
s[i] = '';
if(i != s.length - 1){s[i+1] = s[i+1].toUpperCase()};
k = s.join('');
this.element.style[k] = v.toString();
}
}
},
attr:function(k, v){
if(arguments.length == 1) return this.getAttribute(k)||this.hasAttribute(k);
if(v === false) {this.removeAttribute(k);return v};
if(v === true) {this.setAttribute(k);return v};
this.setAttribute(k, v);
return v;
},
toString:function(d){
var shPar = true;
if(!d && d !== 0) d = lib.defaultViewToStringDepth;
if(d == 0) shPar = false;
//alert(lib.defaultViewToStringDepth);
with(this){
//if(element.constructor == HTMLDocument)
return "[VIEW tagName=\""+tagName+"\" id=\""+id+(shPar?"\" parentView=\""+parentView.toString(d-1):'')+"\"]"
}
},
push:function(e){
this.element.appendChild(e.element)
},
pushBack:function(e){
this.element.insertBefore
(e.element, this.element.firstChild)
}
}
getView = function(e){
return e?(e.VIEW  || View(e)):"[NONE]";
}
this.defaultViewToStringDepth = 0;
baseView = new View(document);
baseView.toString = function() {return "[VIEW baseView]"};
var GE = function(t, s){
var e = GE[t](s);
return getView(e);
}
GE.id = copyFunc(document, document.getElementById);
GE.tagName = copyFunc(document, document.getElementsByTagName);
GE.name = copyFunc(document, document.getElementsByName);
GE.q = copyFunc(document, document.querySelector);

withProto = function(scope, p, f, _static){
var c, i;
_static = _static || {};
c = function() {
//alert(arguments.length);
var args = arguments;
var a = function(){return c.apply(this, args)};
a.prototype = c.prototype;
if (!(this instanceof c /*|| this instanceof a*/)) { return new a()};
this.constructor=c;
//alert(f.apply)
return f.apply(this, arguments) || this;
};
c.toString = copyFunc(f, f.toString);
for(i in _static) {c[i] = _static[i]};
c.prototype = p;
return c;
}

Vectors = {
Vec: withProto(lib, {copy: function(){return new Vectors.Vec(this.dims)}, toString: function() {return '{' + this.dims.join(', ') + '}'}, resize: function(l) {var i; for(i = this.d; i < l; i++) this.dims[i] = 0; this.d = Math.max(l, this.d)}, addSelf: function(v2){var i; v2 = v2.copy(); Vectors.Vec.toMaxDimNum(this, v2); for(i = 0; i < this.d; i++){this.dims[i] += v2.dims[i]}}, subSelf: function(v2){var i; v2 = v2.copy(); Vectors.Vec.toMaxDimNum(this, v2); for(i = 0; i < this.d; i++){this.dims[i] -= v2.dims[i]}}, mulSelf: function(m){
if(!m) {var i; for(i=0;i<this.d;i++){this.dims[i] = 0}}
switch(m.constructor){
case Number: var i; for(i=0;i<this.d;i++)this.dims[i]*=m; break;
case Vectors.SqMatrix: var i,j,l = this.d; m.expandTo(l); var a = this.dims.slice(0), b = m.vals; for(i=0;i<l;i++){this.dims[i]=0;for(j=0;j<l;j++){this.dims[i]+=a[j]*b[i][j]}}; break;
default: break;
}
}}, function(a){
var L;
//alert(a)
if(!a) a = [];
if(a.constructor != [].constructor) {a = [].slice.call(arguments, 0)} else {a = a.slice(0)};
L = a.length;
this.d = L;
this.dims = a;
}, {toMaxDimNum: function(v1, v2) {var l = Math.max(v1.d, v2.d); v1.resize(l); v2.resize(l); return l}, Resized: function(v, l) {v = v.copy(); v.resize(l); return v},
add: function(v1, v2) {v1 = v1.copy(); v1.addSelf(v2); return v1},
sub: function(v1, v2) {v1 = v1.copy(); v1.subSelf(v2); return v1},
mul: function(v1, v2) {v1 = v1.copy(); v1.mulSelf(v2); return v1}
}),
deg: function(a) {return DEG * a},
SqMatrix: withProto(lib, {toString: function(){return '['+this.vals.join('\n')+']'}, addDim: function(){var i, l = this.length, m = this.vals; m[l] = []; m[l].toString = function(){return this.join('\t')}; for(i=0; i<l; i++){m[i][l] = 0; m[l][i] = 0}; m[l][l] = 1; this.length++ }, expandTo: function(a){var i; for(i = this.length; i < a; i++) this.addDim()}, mulSelf: function(m2){var m1 = this.constructor.mul(this, m2); this.length = m1.length; this.vals = m1.vals}}, function(m){
if(arguments.length == 0) m = [];
if(arguments.length > 1 || (arguments[0] && arguments[0].length === undefined)) m = [].slice.call(arguments, 0);
var i, j, l = m.length;
for(i = 0; i < m.length; i++) {
l = Math.max(l, m[i].length);
}
this.length = l;
for(i = 0; i < l; i++) {
m[i] = m[i] || [];
m[i].toString = function(){return this.join('\t')};
for(j = m[i].length; j < l; j++){
m[i][j] = 1 * (i == j);
}}
this.vals = m;
}, {toMaxLength: function(m1,m2){var l=Math.max(m1.length,m2.length);m1.expandTo(l);m2.expandTo(l);return l}, mul: function(a,b){var l=this.toMaxLength(a,b); var c=new Vectors.SqMatrix(); c.expandTo(l); var i,j,r; for(i=0;i<l;i++)for(j=0;j<l;j++){c.vals[i][j]=0;for(r=0;r<l;r++)c.vals[i][j]+=a.vals[i][r]*b.vals[r][j]};return c}
,rotMx: function(a, d) {d = d || [0, 1]; if(d.split){d = d.split(''); d = d.map(function(c){switch(c){case 'x':return 0; case 'y':return 1; case 'z':return 2; default:return 3;}})}; var l = Math.max(d[0], d[1])+1; var Mx = new this(); Mx.expandTo(l); var M = Mx.vals; var d1=d[0], d2=d[1]; var cos = Math.cos(a), sin = Math.sin(a); M[d1][d1] = M[d2][d2] = cos; M[d1][d2] = -sin; M[d2][d1] = sin; return Mx}
}),
Transformator: withProto(lib, {toString: function(){return 'Transformator:{\n' + this.m + '\n' + this.v +'\n}'}, mulMx: function(m){/*alert(this.m.mulSelf);*/ this.m.mulSelf(m); /*alert(this.v.mulSelf);*/ this.v.mulSelf(m); return this}, rot: function(a, d){with(Vectors.SqMatrix){var m = rotMx(a, d); return this.mulMx(m)}}, mov: function(v){}, proceedSelf: function(a){var i; for(i=0; i<a.length; i++) {if(a[i].mulSelf) a[i].mulSelf(this.m); if(a[i].addSelf) a[i].addSelf(this.v)}; return a}, proceed: function(a){var i, b = [], c; for(i=0; i<a.length; i++) {if(!a[i]) continue; c = a[i].constructor; if(c.mul) {b[i] = c.mul(a[i], this.m); if(b[i].addSelf) b[i].addSelf(this.v)}}}}, function(){
var m = new Vectors.SqMatrix(); this.m = m; var v = new Vectors.Vec(); this.v = v
})
}


this.R = R;
this.View = View;
this.GE = GE;
this.getView = getView;
this.Vectors = Vectors;
this.Graphics = Graphics;
this.compFloat = compFloat;

window[libName] = this;
})("lib");
} catch(e) {alert('init:' + e)}
