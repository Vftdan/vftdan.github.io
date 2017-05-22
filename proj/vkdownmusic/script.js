(function() {
    var els = [].slice.apply(document.querySelectorAll(".audio_row"), [0]);
    var aids = [];
    var buildBody = function(d) {
        var i, a = [];
        for (i in d) {
            a.push(i + "=" + encodeURIComponent(d[i]));
        }
        return a.join("&");
    }
    var trimSplit = function(s, l, r, sep) {
        return s.replace(new RegExp("^" + escapeRE(l) + "|" + escapeRE(r) + "$"), "").split(sep);
    }
    els.map(function(el) {
        var attr = trimSplit(el.getAttribute("data-audio"), '[', ']', ',');
        aids.push(attr[1] + "_" + attr[0]);
    });
    var i, xhr, rets = [];
    for (i = 0; i < aids.length; i += 10) {
        xhr = new XMLHttpRequest();
        xhr.open("POST", "https://vk.com/al_audio.php", false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(buildBody({
            "act": "reload_audio",
            "al": "1",
            "ids": aids.slice(i, Math.min(i + 9, aids.length - 1)).join(",")
        }));
        rets = rets.concat(trimSplit(xhr.responseText.split("<!>")[5], "<!json>[[", "]]", "],["));
    }
    console.log(rets);
    var div = document.createElement("div"),
        row, rows = [];
    for (i = 0; i < rets.length; i++) {
        if (rets[i] != "<!json>[]") {
            rets[i] = JSON.parse("[" + rets[i].replace(/\]\]$/gi, "") + "]");
            row = document.createElement("a");
            row.setAttribute("download", (rets[i][4] + " - " + rets[i][3]).replace(/[\\\/\?\*:\"\<\>]/gi, ""));
            row.setAttribute("target", "_blank");
            row.setAttribute("href", rets[i][2]);
            row.innerHTML = "\<b\>" + rets[i][4] + "\</b\> - " + rets[i][3];
            div.appendChild(row);
            div.appendChild(document.createElement("br"));
            rows.push(row);
        }
    }
    div.style.background = "#EDEEF0";
    div.style.height = "100%";
    var downAll = document.createElement("input");
    downAll.setAttribute("type", "button");
    downAll.setAttribute("value", "Скачать/открыть всё");
    downAll.onclick = function() {
        var i;
        for (i in rows) {
            rows[i].click();
        }
    }
    div.appendChild(downAll);
    var pl = document.getElementById("content").firstChild;
    pl.insertBefore(div, pl.firstChild.nextSibling.nextSibling);
})();
