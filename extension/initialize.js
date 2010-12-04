if (top == self) {
	var mode = "extension";
	var path = chrome.extension.getURL("/");
	var scripts = new Array("jquery.min.js", "jquery.textarea.js", "CodeMirror/cmc.js", "morpheus.js");
	var options;
	chrome.extension.sendRequest({"action": "getOptions"}, function(data) {
		options = data;
	});
	var html = "<html id=\"Morpheus\"><head><script type=\"text/javascript\">var path = \"" + path + "\"; var mode = \"" + mode + "\";</script>";
	for (i = 0; i < scripts.length; i++)
		html = html + "<script type=\"text/javascript\" src=\"" + scripts[i] + "\"></script>";
	html = html + "</head><body></body></html>";
	window.onload = function() {
		document.onkeyup = function() {
			var e = window.event;
			var wich = e.keyCode != null ? e.keyCode : e.charCode;
			if (wich == 113 && document.getElementById("Morpheus") == null) {
				document.open();
				document.write(html);
				document.close();
			}
		}
	}
}
