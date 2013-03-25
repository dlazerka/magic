$(function() {
	function el(clazz) {
		return $('#base64 .' + clazz);
	}
	var et = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var dt = {};
	for (var i = 0; i < et.length; i++) {
		dt[et.charAt(i)] = i;
	}

	function encode(s) {
		function at(s, i) {
		    var result = s.charCodeAt(i);
		    if (result > 255) {
		        throw 'Chars must be 8 bit';
		    }
			return result;
		}
		var startedAt = new Date().getTime();
		var ar = new Uint32Array(Math.ceil(s.length / 3) * 4);
		// var r = [];
		for (var i = 0; i < s.length; i += 3) {
			// r.push(at(s, i) >> 2);
			ar[i] = at(s, i) >> 2;
			// r.push((at(s, i) & 3) << 4);
			ar[i+1] = (at(s, i) & 3) << 4;
			if (i + 1 < s.length) {
			    // r[r.length - 1] |= at(s, i + 1) >> 4;
			    ar[i + 1] |= at(s, i + 1) >> 4;
				// r.push((at(s, i + 1) & 15) << 2);
				ar[i + 2] = (at(s, i + 1) & 15) << 2;
			}
			if (i + 2 < s.length) {
			    // r[r.length - 1] |= at(s, i + 2) >> 6;
			    ar[i + 2] |= at(s, i + 2) >> 6;
				// r.push(at(s, i + 2) & 63);
			    ar[i + 3] = at(s, i + 2) & 63;
			}
		}
		// r = r.map(function(c) {return et[c]});
		for (var i = 0; i < ar.length; i++) {
		    ar[i] = et[ar[i]];
		}
		if (s.length % 3 == 1) {
		    ar[ar.length - 1] = '=';
		    ar[ar.length - 2] = '=';
		} else if (s.length % 3 == 2) {
            ar[ar.length - 1] = '=';
		}
		ar = Array.apply([], ar); // convert back to Array
		ar = ar.join('');
		// r = r.join('');
		// r = r.replace(/(.{72})/g, '$1\r\n');
		var endedAt = new Date().getTime();
		console.log('Encoding took ' + (endedAt - startedAt) + ' ms');
		return r;
	}

	function decode(s) {
		function at(s, i) {
			return dt[s.charAt(i)];
		}
		s = s.replace(/\n|\r/g, '');
		if (s.length % 4 != 0) {
		    throw 'Base64 encoded string must always be ';
		}
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
	    encode(String.fromCharCode(0)) === 'AA==' || fail();
	    decode('AA==') === String.fromCharCode(0) || fail();

	    var allChars = [];
	    for (var i = 0; i < 256; i++) {
	        allChars.push(String.fromCharCode(i));
	    }
	    allChars = allChars.join('');
	    var actual = decode(encode(allChars));
	    if (actual !== allChars) {
	        for (var i = 0; i < Math.max(actual.length, allChars.length); i++) {
	            if (actual[i] !== allChars[i]) {
	                console.log(i);
	                fail();
	            }
	        }
	    }

	    console.log('passed');
	}

    var blob;
    function process(func, input) {
        var result = func(input);
        blob = new Blob ([result], {type:'application/binary'});
        el('text').val(result);
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
        }
        var url = window.URL.createObjectURL(blob);
        // var uriContent = "data:application/octet-stream," + encodeURIComponent(blob);
        window.open(url);
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
