$(function() {
	function el(clazz) {
		return $('#base64 .' + clazz);
	}
	t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	function at(s, i) {
		return i < s.length ? s.charCodeAt(i) : 0;
	}
	
	function encode(s) {
		var r = [];
		for (var i = 0; i < s.length; i += 3) {
			if ((i % 54) == 0) {
				r.push('\n');
			}
			r.push(t[at(s, i) >> 2]);
			r.push(t[((at(s, i) & 3) << 4) | at(s, i + 1) >> 4]);
			if (i + 1 < s.length) {
				r.push(t[((at(s, i + 1) & 15) << 2) | at(s, i + 2) >> 6]);
			} else {
				r.push('=');
			}
			if (i + 2 < s.length) {
				r.push(t[at(s, i + 2) & 63]);
			} else {
				r.push('=');
			}
		}
		r.shift();
		return r.join('');
	}
	function encodeEl() {
		var decoded = el('decoded').val();
		var encoded = encode(decoded);
		el('encoded').text(encoded);
	}
	
	var sample = 'Man is distinguished, not only by his reason, but by this singular passion ' +
		'from other animals, which is a lust of the mind, that by a perseverance ' +
		'of delight in the continued and indefatigable generation of knowledge, ' +
		'exceeds the short vehemence of any carnal pleasure.';
	el('decoded').text(sample);
	encodeEl();
	el('decoded').keyup(encodeEl);
});
