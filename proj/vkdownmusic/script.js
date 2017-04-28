window.downloadFromURL = fuction(url) {
	var a = document.createElement("a");
	a.setAttribute("download", "download");
	a.setAttribute("href", url);
	a.click();
}
(function(){
	var els = [].slice.apply(document.querySelectorAll(".audio_row"), [0]);
	var aids = [];
	var trimSplit = function(s, l, r, sep) {
		return s.replace()
	}
	els.map(function(el){
		var attr = el.getAttribute("data-audio");
	});
})();
