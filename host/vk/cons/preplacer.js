//alert(0);
var pReplacer = (function(){
    function cors(url) {
        return 'https://cors-anywhere.herokuapp.com/' + url;
    }
    function realHref(host, base, rel) {
        base = base.replace(/[\#\?].*/, '');
        if(rel[0] == '/') {
            if(rel[1] == '/') {
                return rel;
            } else {
                if(host) {
                    return host + rel;
                } else {
                    return rel;
                }
            }
        } else {
            if(rel.match(/^\w+\:/)) return rel;
            if(base[base.length - 1] != '/') base += '/';
            return base + rel;
        }
    }
    function parseDom(s, base, host) {
        var parser = new DOMParser();
        doc = parser.parseFromString(s, 'text/html');
        els = doc.querySelectorAll('[href], [src]');
        var i;
        for(i = 0; i < els.length; i++) {
            var el = els[i];
            for(j in {src: '', href: ''}) {
                if(el.hasAttribute(j)) {
                    el.setAttribute(j, realHref(host, base, el.getAttribute(j)));
                }
            }
        }
        return doc.lastChild.outerHTML;
    }
    function getWeb(url, cb) {
        var x = new XMLHttpRequest();
        x.open('GET', cors(url), true);
        x.onload = function() {
            try {
                cb(x.responseText);
            } catch(e) {
                console.err(e);
            }
        }
        x.send();
    }
    function getContent(url, cb) {
        var host = '';
        if(url.match(/^(\w*\:)?\/{2}/)) {
            host = url.match(/^(\w*\:)?\/{2}[^\/]*/)[0];
        }
        getWeb(url, function(t) {
            s = parseDom(t, url, host);
            cb(s);
        });
    }
    function replace(url, cb) {
        getContent(url, function(t) {
            document.open('text/html', 'replace');
            document.write(t);
            if(typeof cb == 'function') cb();
        });
    }
    return {getContent: getContent,
            replace: replace};
})();