$(function() {
	function el(clazz) {
		return $('#base64 .' + clazz);
	}

    var blob;
    function process(func, input) {
        var result = func(input);
        blob = new Blob ([result], {type:'application/octet-binary'});
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
    
    function encode(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }
    
    function decode(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    function download(event) {
        event.preventDefault();
        if (!blob) {
            test();
            return;
        }
        var url = window.URL.createObjectURL(blob);
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
