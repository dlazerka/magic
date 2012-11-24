$(function() {
	function getElement(clazz) {
		return $('#unixtime .' + clazz)
	}
	function convertTs() {
		var input = parseInt(getElement('ts').val())
		var dateS = new Date(input * 1000);
		var dateMs = new Date(input);
		var dateMks = new Date(input / 1000);
		var today = new Date();
		var diffS = Math.abs(today - dateS);
		var diffMs = Math.abs(today - dateMs);
		var diffMks = Math.abs(today - dateMks);
		var units;
		var date;
		
		if (diffS < diffMs) {
			date = dateS
			units = 's'
		} else if (diffMks < diffMs) {
			date = dateMks
			units = 'mks';
		} else {
			date = dateMs
			units = 'ms';
		}
		var dateUTC = new Date((date-0) + date.getTimezoneOffset() * 60000);
		getElement('utc').text(dateUTC.toString('dd MMM yyyy HH:mm:ss UTC'));
		getElement('local').text(date.toString('dd MMM yyyy HH:mm:ss Local'));
		getElement('units').text(units);
		var diff = Math.round((today - date) / 1000);
		
		// Show delta
		var span = diff >= 0 ? 'ago' : 'in future';
		diff = Math.abs(diff)
		var d = Math.floor(diff / (24 * 3600));
		var h = Math.floor((diff / 3600) % 24);
		var m = Math.floor((diff / 60) % 60);
		var s = Math.floor(diff % 60);
		getElement('diff').text(d + 'd ' + h + ':' + m + ':' + s + ' ' + span);
	};

	getElement('ts').keyup(convertTs);
	getElement('ts').val(new Date().getTime())
	convertTs();
});