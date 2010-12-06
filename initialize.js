/*
    Copyright (c) 2010 Juan Pablo Kaniefsky

    This file is part of Morpheus.

    Morpheus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    any later version.

    Morpheus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Morpheus.  If not, see <http://www.gnu.org/licenses/>.

    Juan Pablo Kaniefsky (jpkaniefsky@gmail.com)
*/
if (top == self) {
	var path = document.getElementById("morph_dir").rel + "/";
	var scripts = new Array("options.js", "jquery.min.js", "jquery.textarea.js", "CodeMirror/cmc.js", "morpheus.js");
	var html = "<html><head><script type=\"text/javascript\">var path = \"" + path + "\";</script>";
	for (i = 0; i < scripts.length; i++)
		html = html + "<script type=\"text/javascript\" src=\"" + path + scripts[i] + "\"></script>";
	html = html + "</head><body></body></html>";
	window.onload = function() {
		document.onkeyup = function() {
			var e = window.event;
			var wich = e.keyCode != null ? e.keyCode : e.charCode;
			if (wich == 113) {
				document.open();
				document.write(html);
				document.close();
			}
		}
	}
}
