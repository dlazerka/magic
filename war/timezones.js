$(function() {
	function getElement(clazz) {
		return $('#timezones .' + clazz)
	}
	function toString(date) {
		function pad(n) {
			return n >= 10 ? n : '0' + n;
		}
		return date.getFullYear() + '-' +
			pad(date.getMonth() + 1) + '-' +
			pad(date.getDate()) + ' ' +
			pad(date.getHours()) + ':' +
			pad(date.getMinutes()) + ':' +
			pad(date.getSeconds());
	}
	function adjustTsUnits() {
		var val = getElement('ts').val();
		if (val.length < 13) {
			getElement('units').text('s');
		} else if (val.length > 13) {
			getElement('units').text('mks');
		} else {
			getElement('units').text('ms');
		}
	}
	function getTsMs() {
		var val = getElement('ts').val();
		if (val.length < 13) {
			val *= 1000;
		} else if (val.length > 13) {
			val /= 1000;
		}
		return Number(val);
	}
	function showDelta() {
		var now = new Date().getTime();
		var ts = getTsMs();
		var diff = Math.round((now - ts) / 1000);

		var span = diff >= 0 ? 'ago' : 'in future';
		diff = Math.abs(diff);
		var d = Math.floor(diff / (24 * 3600));
		var h = Math.floor((diff / 3600) % 24);
		var m = Math.floor((diff / 60) % 60);
		var s = Math.floor(diff % 60);
		getElement('diff').text(d + 'd ' + h + ':' + m + ':' + s + ' ' + span);
	}
	function convert(from, to) {
		var t1 = getElement('time' + from).val();
		var tz1 = getElement('tz' + from).val();
		var tz2 = getElement('tz' + to).val();

		// Correct date in 'from' fields.
		var date = new Date(t1 + ' ' + tz1);

		// Difference between local tz and 'to' tz.
		var diff = new Date(t1) - new Date(t1 + ' ' + tz2);

		// Incorrect date, but will give toString() in tz2.
		var toDate = new Date(date.getTime() + diff);
		var t2 = toString(toDate);

		getElement('time' + to).val(t2);
		getElement('ts').val(date.getTime());
		showDelta();
		adjustTsUnits();
	}
	function convertTs() {
		var ts = getTsMs();
		var tz1 = getElement('tz1').val();
		var tz2 = getElement('tz2').val();

		// Correct date.
		var date = new Date(ts);
		var s = toString(date);

		// Dummy date to measure difference with timezoned.
		var dummy = new Date(s + ' ' + tz1);
		var diff = dummy - date;
		var date1 = new Date(ts - diff);

		dummy = new Date(s + ' ' + tz2);
		diff = dummy - date;
		var date2 = new Date(ts - diff);

		getElement('time1').val(toString(date1));
		getElement('time2').val(toString(date2));
		showDelta();
		adjustTsUnits();
	}

	var date = new Date();
	getElement('time2').val(toString(date));
	var tz = date.toString().match(/\(([A-Z]+)\)/);
	if (tz) {
		tz = tz[1];
		getElement('tz2').val(tz);
	} else {
		getElement('tz2').val(date.getUTCOffset());
	}

	getElement('time1').keyup(function () {convert('1', '2')});
	getElement('tz1').keyup(function () {convert('1', '2')});
	getElement('time2').keyup(function () {convert('2', '1')});
	getElement('tz2').keyup(function () {convert('2', '1')});
	getElement('ts').keyup(function () {convertTs()});
	getElement('ts').change(function () {convertTs()});
//	getElement('ts').val(new Date().getTime())
	convert('2', '1');
});