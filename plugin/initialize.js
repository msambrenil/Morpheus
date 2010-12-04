if (top == self) {
	var mode = "plugin";
	var path = document.getElementById("morph_dir").rel + "/";
	var scripts = new Array("options.js", "jquery.min.js", "jquery.textarea.js", "CodeMirror/cmc.js", "morpheus.js");
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
