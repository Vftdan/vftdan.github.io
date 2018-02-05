function OrphominInit(elWord, elInput) {
    var fcontent = '', loadFile, words, parseFile, reload, ruUp = /[А-ЯЁ]/g, ruLo = /[а-яё]/g, getRandWord, trim, showWord, nextWord, submit, cdiv, sbgc, escapeHtml;
    var Orphomin = {faddr: '/proj/orphomin/custom.txt'
                    ,getSubmit: function() {
                        return submit;
                    }
                    };
    trim = function(s) {
        return (s + '').replace(/^\s*|\s*$/g, '');
    };
    escapeHtml = function(s) {
        return s.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
    };
    loadFile = function(cb, onerr) {
        var x = new XMLHttpRequest();
        x.open('GET', Orphomin.faddr);
        x.onreadystatechange = function() {
            if(x.readyState == 4) {
                if(x.status == 200) {
                    fcontent = x.responseText;
                    cb();
                } else onerr(x);
            }
        }
        x.send();
    };
    parseFile = function() {
        var w, i;
        words = [];
        l = fcontent.split('\n');
        for(i = 0; i < l.length; i++) {
            w = trim(l[i]);
            if(w[0] == '#' || !w.match(ruUp)) continue;
            words.push([w.toLowerCase(), w.indexOf(w.match(ruUp)[0])]);
        }
    };
    reload = function() {
        loadFile(parseFile, alert);
    };
    getRandWord = function() {
        return words[(Math.random() % 1) * words.length | 0];
    };
    Orphomin.reload = reload;
    Orphomin.getRandWord = getRandWord;
    window.Orphomin = Orphomin;
    
    cdiv = function(cn) {
        var d = document.createElement('div');
        if(cn) d.setAttribute('class', cn);
        return d;
    };
    sbgc = function(s, c) {
        return '<span style="background:' + c + '">' + s + '</span>';
    };
    showWord = function(w, prevs) {
        elWord.innerHTML = '';
        if(prevs) {
            var pd = cdiv('status');
            pd.innerHTML = prevs;
            elWord.appendChild(pd);
        }
        var d = cdiv('word');
        var ls = w[0].split('');
        var i, j = 0, cor;
        for(i = 0; i < ls.length; i++) {
            var lw = cdiv('lw');
            if(ls[i].match(ruLo)) {
                var li = cdiv('li');
                li.innerText = ++j + '';
                if(i == w[1]) {
                    cor = j;
                }
                lw.appendChild(li);
            }
            var ll = cdiv('ll');
            ll.innerText = ls[i];
            lw.appendChild(ll);
            d.appendChild(lw);
        }
        elWord.appendChild(d);
        return cor;
    };
    nextWord = function(s) {
        var w = getRandWord();
        var cor;
        submit = function() {
            if(cor === undefined || elInput.innerText.length == 0) return;
            var c = cor == parseInt(elInput.innerText);
            elInput.innerText = '';
            nextWord(c ? 'Ok' : 'Fail');
        };
        cor = showWord(w, s);
    };
    
    elInput.addEventListener('keydown', function(e){
        if(e.keyCode == 10 || e.keyCode == 13) {
            if(submit) {
                try {
                    submit();
                } catch(e) {
                    alert(e);
                }
            }
            e.preventDefault();
        }
    }, false);
    
    submit = function() {
        if(words) nextWord();
    };
    reload();
    alert(0);
    //loadFile(function(){try{parseFile();alert(showWord(getRandWord(), 'Ok'))}catch(e){document.write(e)}}, alert)
}