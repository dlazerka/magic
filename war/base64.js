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
			r.push((at(s, i + 1) & 15) << 4 | at(s, i + 2) >> 2);
			r.push((at(s, i + 2) & 3) << 6 | at(s, i + 3));
		}
		r = r.map(function(i) {return String.fromCharCode(i)});
		return r.join('');
	}

	function encodeEl() {
		var decoded = el('decoded').val();
		var encoded = encode(decoded);
		el('encoded').text(encoded);
	}

	function decodeEl() {
		var encoded = el('encoded').val();
		var decoded = decode(encoded);
		el('decoded').text(decoded);
	}
	
	var sample = 'Man is distinguished, not only by his reason, but by this singular passion ' +
		'from other animals, which is a lust of the mind, that by a perseverance ' +
		'of delight in the continued and indefatigable generation of knowledge, ' +
		'exceeds the short vehemence of any carnal pleasure.';
//	sample = 'Man';
	el('decoded').text(sample);
	encodeEl();
	decodeEl();
	el('decoded').keyup(encodeEl);
	el('encoded').keyup(decodeEl);
});
