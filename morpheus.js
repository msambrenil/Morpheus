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
var editor;
var wrapping;
var views = new Array(
	{ height: "100%", width: "100%", left: "0px", right: "0px", top: "0px", bottom: "0px" },
	{ height: "100%", width: "50%", left: "0px", right: "auto", top: "0px", bottom: "0px" },
	{ height: "100%", width: "50%", left: "auto", right: "0px", top: "0px", bottom: "0px" },
	{ height: "50%", width: "100%", left: "0px", right: "0px", top: "0px", bottom: "auto" },
	{ height: "50%", width: "100%", left: "0px", right: "0px", top: "auto", bottom: "0px" }
);
var cv = 0;
var to;
var page;
var oldpage;

if (!options.effects)
	$.fx.off = true;

function keyd(e) {
	var key = parseInt(e.keyCode);
	if (key == 113 || key == 114 || key == 115) {
		e.keyCode = 0;
		e.preventDefault();
		e.stopPropagation();
	}
}

function keyu(e) {
	var key = parseInt(e.keyCode);
	if (typeof editor == "undefined")
		editor = window.parent.editor;
	if (key == 113) {
		if (wrapping.css("display") == "none") {
			wrapping.slideDown(1000, "linear", function() {
				editor.focus();
			});
		} else {
			wrapping.slideUp(1000, "linear");
		}
	} else if (key == 114 && wrapping.css("display") != "none") {
		if (cv < 4)
			cv += 1;
		else
			cv = 0;
		wrapping.css(views[cv]);
	} else if (key == 115 && wrapping.css("display") != "none") {
		$.post(path + "controller.php?a=save&url=" + location.href, { "code": editor.getCode() }, function(data) { alert(data); });
	} else if ((key < 37 || key > 40) && (key < 16 || key > 18) && wrapping.css("display") != "none") {
		/*var code = editor.getCode();
		$("iframe#page").contents().find("head").html(code.split(new RegExp("<head>|</head>"))[1]);
		$("iframe#page").contents().find("body").html(code.split(new RegExp("<body>|</body>"))[1]);*/
		clearTimeout(to);
		to = setTimeout(function() {
			$.post(path + "controller.php?a=evaluate&url=" + location.href, { "code": editor.getCode() }, function(data) {
				refresh(data);
			});
		}, 1500);
	}
}

function refresh(code) {
	oldpage = page;
	page = $("<iframe frameborder='0' style='display:none; height:100%; width:100%; border:0px; position:absolute; top:0px; left:0px;'></iframe>");
	$("body").append(page);
	var doc = page.get(0).contentWindow || page.get(0).contentDocument;
	if (doc.document)
		doc = doc.document;
	if (jQuery.browser.msie) {
		var scripts = $(code).filter("script");
			code = code.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/ig, "");
	} 
	code = code.replace(/top.location.href(?:(?!(\;|\)\!)).)*?=/ig, "var paraquetengasputo = ");
	doc.open();
	doc.write(code);
	doc.close();
	$(doc).bind("keyup", keyu);
	$(doc).bind("keydown", keyd);
	if (typeof scripts != "undefined") {
		scripts.each(function() {
			var script = doc.createElement("script");
			script.text = this.text;
			script.type = this.type;
			script.src = this.src;
			page.contents().find("head").get(0).appendChild(script);
		});
	}
	setTimeout(function() {
		document.title = page.contents().find("title").html();
		page.css("display", "inline");
		oldpage.remove();
		if (wrapping.css("display") == "none")
			wrapping.slideDown(1000, "linear");
		editor.focus();
	}, 1000);
}


$(document).ready(function() {
	page = $(document.body.childNodes[0]);
	if (options.codemirror) {
		editor = new CodeMirror(document.body, {
			height: "100%",
			path: path + "CodeMirror/",
			basefiles: "js/compiled.js",
			stylesheet: [ path + "CodeMirror/css/xmlcolors.css", path + "CodeMirror/css/jscolors.css", path + "CodeMirror/css/csscolors.css", path + "CodeMirror/css/phpcolors.css"],
			tabMode: options.tabMode,
			continuousScanning: 500
		});
		wrapping = $(editor.wrapping);
	} else {
		wrapping = $("<div>");
		var textarea = $("<textarea spellcheck=false style=\"background:none; height:100%; width:100%; color: #fff; font-size: " + options.fontsize + "; font-weight: " + options.fontweight + ";\"></textarea>");
		wrapping.append(textarea);
		$("body").append(wrapping);
		editor = new Object();
		editor.wrapping = wrapping;
		editor.textarea = textarea;
		editor.getCode = function() {
			return editor.textarea.val();
		}
		editor.setCode = function(code) {
			editor.textarea.val(code);
		}
		editor.focus = function() {
			editor.textarea.focus();
		}
		if (options.tabMode == "spaces")
			textarea.tabby();
	}
	wrapping.css({"display": "none", "position": "absolute", "top": "0px", "left": "0px", "opacity": options.opacity, "height": "100%", "width": "100%", "z-index": "9999", "background-color": "#111"});
	setTimeout(function() {
		if (options.codemirror) {
			var doc = editor.frame.contentWindow || editor.frame.contentDocument;
			if (doc.document)
				doc = doc.document;
			$(doc).bind("keyup", keyu);
			$(doc).bind("keydown", keyd);
		}
		$.get(path + "controller.php?a=getSource&url=" + location.href, function(data) {
			//data = data.replace(/<(.*?)(morph_dir|initialize.js)([\s\S]*?)\/(.*?)>/ig, "");
			$.post(path + "controller.php?a=evaluate&url=" + location.href, { "code": data }, function(pdata) { refresh(pdata); });
			editor.setCode(data);
			if (options.codemirror)
				$(editor.frame).contents().find("body").css({"font-size": options.fontsize, "font-weight": options.fontweight, "background-color": "#111"});
		});
	}, 1500);
	$(document).bind("keyup", keyu);
	$(document).bind("keydown", keyd);
});
