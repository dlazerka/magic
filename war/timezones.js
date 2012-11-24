$(function() {
	function getElement(clazz) {
		return $('#timezones .' + clazz)
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
		var t2 = toDate.toString('yyyy-MM-dd HH:mm:ss');

		// Meaningless date for difference
		getElement('time' + to).val(t2);
	};
	
	function getTz(d) {
//	  var tz = d.toString().match(/\(([A-Z]+)\)/);
//	  if (tz) {
//	    return tz[1];
//	  }

	  var offset = d.getTimezoneOffset();
	  var offsetStr = (offset / 60);
	  if ((offset % 60)) {
	    offsetStr += ':' + (offset % 60) 
	  }
	  if (offset > 0) {
	    offsetStr = '+' + offsetStr;
	  }
	  return offsetStr;
	}

//	getElement('inTime').keyup(refresh);
	var date = new Date();
	getElement('time2').val(date.toString('yyyy-MM-dd HH:mm:ss'));
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
//	getElement('ts').val(new Date().getTime())
	convert('2', '1');
});