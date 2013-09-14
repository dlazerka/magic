$(function() {
	function el(clazz) {
		return $('#base64 .' + clazz);
	}

	function encode(str) {
		var encoded = encodeURIComponent(str);
		var unescaped = unescape(encoded);
		return window.btoa(unescaped);
	}

	function decode(str) {
		str = str.replace(/\r|\n/g, '');
		var atob = window.atob(str);
		var escaped = escape(atob);
		return decodeURIComponent(escaped);
	}

	var CONTENT = null;
	function readUpload() {
		var fileEl = el('file')[0];
		var file = fileEl.files[0];
		var input;
		if (!file) {
			throw 'no file';
		}
		el('text').attr('disabled', true);
		var fr = new FileReader();
		fr.onload = function() {
			CONTENT = fr.result;
			el('text').val(CONTENT);
		};
		fr.readAsBinaryString(file);
	}

	function clear(event) {
		event.preventDefault();
		el('file').val('');
		el('text').attr('disabled', false);
		el('text').val('');
		CONTENT = null;
	}

	function process(func) {
		var input = CONTENT ? CONTENT : el('text').val();
		var output = func(input);
		el('text').val(output);
		if (CONTENT) {
			CONTENT = output;
		}
	}

	function download(event) {
		event.preventDefault();
		// Converting CONTENT to array of bytes to create Blob with.
		// Creating Blob with just CONTENT kinda works, but on downloading browser would utf8-encode all >127 chars.
		// The same way if creating Blob with application/base64.
		var bytes = new Uint8Array(CONTENT.length);
		for( var i = 0; i < CONTENT.length; ++i ) {
			bytes[i] = CONTENT.charCodeAt(i);
		}
		var blob = new Blob([bytes], {type:'application/octet-binary'});

		var url = window.URL.createObjectURL(blob);
		window.open(url);
	}

	var HEXED = false;
	function hex() {
		if (!CONTENT) return;
		var str;
		if (HEXED) {
			str = CONTENT;
		} else {
			str = [];
			for (var i = 0; i < CONTENT.length; i++) {
				var c = CONTENT.charCodeAt(i);
				c = c.toString(16);
				if (c.length == 1) {
					c = '0' + c;
				}
				str.push(c);
				if (i % 2) {
					str.push(' ');
				}
				if (i % 16 == 15) {
					str.push('\n');
				}
			}
			str = str.join('');
		}
		HEXED = !HEXED;
		el('text').val(str);
	}

	var sample = 'Loren ipsum.';
	el('text').val(sample);
	el('encode').on('click', function() {process(encode)});
	el('decode').on('click', function() {process(decode)});
	el('download').on('click', download);
	el('file').on('change', readUpload);
	el('clear').on('click', clear);
	el('hex').on('click', hex);
});
