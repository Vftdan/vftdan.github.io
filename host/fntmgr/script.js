(function(deploy){
var getKey = function(s) {
return '%fntmgr::' + btoa(s);
}
var getMime = function(ext) {
ext += '';
if(ext.match(/^[\w+-]+\/[\w+-]+$/)) return ext;
ext = (ext + '').toLowerCase();
if(ext[0] == '.') ext = ext.substr(1);
if(!ext) ext = 'ttf';
switch(ext) {
case 'svg': return 'image/svg+xml';
default: return 'font/' + ext;
}
}
var btoaBinary = function(s) {
return btoa(unescape(encodeURIComponent(s)));
}
var includeFont = function(props) {
var name, url, callback, result = {included: false, saved: false, downloaded: false, exception: null, ff: null}, key, data, ff, mime, nostorage;
name = props.name;
if(!name) throw 'No name';
name += '';
url = props.url;
callback = props.callback;
nostorage = props.nostorage;
mime = props.mime?getMime(props.mime):((url&&(url + '').match(/\.[\w+-]$/))?(getMime((url+'').match(/\.[\w+-]$/)[0])):getMime('ttf'));
if((typeof callback) != 'function') callback = null;
key = getKey(name);
try {
if(localStorage&&!nostorage) {
try {
data = localStorage.getItem(key);
if(data.match(/^[\w\/+]+[=]*$/)){
ff = new FontFace(name, 'url(data:' + mime + ';base64,' + data + ')');
document.fonts.add(ff);
result.included = result.saved = true;
result.ff = ff;
setTimeout(function(){callback(result)}, 0);
}
} catch(e) {}
}
if(!result.included&&url) {
url += '';
var x = new XMLHttpRequest();
x.open('GET', url, true);
x.onreadystatechange = function() {
if(x.readyState != 4) return;
try {
if(!x.status||nostorage) {
ff = new FontFace(name, url);
document.fonts.add(ff);
result.included = true;
result.ff = ff;
if(callback) callback(result);
return;
}
data = btoaBinary(x.responseText);
result.downloaded = true;
if(localStorage) {
try {
localStorage.setItem(key, data);
result.saved = true;
} catch(e) {}
}
ff = new FontFace(name, 'url(data:' + mime + ';charset=utf8;base64,' + data + ')');
document.fonts.add(ff);
result.included = true;
result.ff = ff;
if(callback) callback(result);
} catch(e) {
result.exception = e;
if(callback) callback(result);
}
}
x.send();
}
} catch(e) {
result.exception = e;
if(callback) callback(result);
}
}
window[deploy] = includeFont;
})('$IncludeFont');