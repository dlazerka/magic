$(function() {
	function el(clazz) {
		return $('#base64 .' + clazz);
	}
	var et = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var dt = {};
	for (var i = 0; i < et.length; i++) {
		dt[et.charAt(i)] = i;
	}
	
	function encode(s) {
		function at(s, i) {
			return s.charCodeAt(i);
		}
		var r = [];
		for (var i = 0; i < s.length; i += 3) {
			r.push(at(s, i) >> 2);
			r.push(((at(s, i) & 3) << 4) | at(s, i + 1) >> 4);
			if (i + 1 < s.length) {
				r.push(((at(s, i + 1) & 15) << 2) | at(s, i + 2) >> 6);
			}
			if (i + 2 < s.length) {
				r.push(at(s, i + 2) & 63);
			}
		}
		r = r.map(function(c) {return et[c]});
		if (s.length % 3 == 1) {
			r.push('==')
		} else if (s.length % 3 == 2) {
			r.push('=');
		}
		r = r.join('');
		r = r.replace(/(.{72})/g, '$1\r\n');
		return r;
	}

	function decode(s) {
		function at(s, i) {
			return dt[s.charAt(i)];
		}
		s = s.replace(/\n|\r/g, '');
		var r = [];
		for (var i = 0; i < s.length; i += 4) {
			r.push(at(s, i) << 2 | at(s, i + 1) >> 4);
			if (s.charAt(i + 2) != '=') {
                r.push((at(s, i + 1) & 15) << 4 | at(s, i + 2) >> 2);
			}
			if (s.charAt(i + 3) != '=') {
                r.push((at(s, i + 2) & 3) << 6 | at(s, i + 3));
			}
		}
		r = r.map(function(i) {return String.fromCharCode(i)});
		return r.join('');
	}

	function test() {
	    //function fail() {throw 'failed'};
	    encode('asd') === 'YXNk' || fail();
	    decode('YXNk') === 'asd' || fail();
	    encode('1023e') === 'MTAyM2U=' || fail();
	    decode('MTAyM2U=') === '1023e' || fail();
	    console.log('passed');
	}

    var blob;
    function process(func, input) {
        blob = func(input);
        el('text').val(blob);
    }

    function getAndProcess(func) {
        var fileEl = el('file')[0];
        var file = fileEl.files[0];
        var input;
        if (file) {
            var fr = new FileReader();
            fr.onload = function() {
                fileEl.value = '';
                process(func, fr.result);
            };
            fr.readAsBinaryString(file);
        } else {
            input = el('text').val();
            process(func, input);
        }
    }

    function download(event) {
        event.preventDefault();
        if (!blob) {
            test();
            return;
            // blob = el('text').val();
        }
        var uriContent = "data:application/octet-stream," + encodeURIComponent(blob);
        window.open(uriContent);
    }

	var sample = 'Man is distinguished, not only by his reason, but by this singular passion ' +
		'from other animals, which is a lust of the mind, that by a perseverance ' +
		'of delight in the continued and indefatigable generation of knowledge, ' +
		'exceeds the short vehemence of any carnal pleasure.';
	el('text').val(sample);
	el('encode').on('click', function() {getAndProcess(encode)});
	el('decode').on('click', function() {getAndProcess(decode)});
	el('download').on('click', download);
});
