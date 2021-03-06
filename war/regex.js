$(function() {
	function getElement(clazz) {
		return $('#regex .' + clazz)
	}
	function testRegex() {
		getElement('execs').empty();
		getElement('error').text('');
		try {
			var regExp = new RegExp(
					getElement('pattern').val(),
					getElement('modifiers').val());
		} catch (e) {
			try {
				getElement('error').text('' + e);
			} catch (e) {}
			return;
		}
		var sample = getElement('sample').val();
		for (i = 0; i < 9; i++) {
			var groups = sample.match(regExp);
			if (!groups) {
				break;
			}
			sample = sample.substr(groups.index + groups[0].length);
			getElement('execs').append(
				'<div class="run"><div class="label">Run ' + (i+1) + '</div>' +
					'<div class="groups"></div>' +
				'</div>');
			$(groups).each(function(j, group) {
				if (!group) return;
				var escaped = group.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				$('.run:last-child .groups', getElement('execs'))
					.append('<div class="group"><div class="groupNo">' + j + '</div>' +
							'<div class="groupContent">' + escaped + '</div></div>');
			});
		}
	}
	function saveToLocalStorage() {
		var pattern = getElement('pattern').val();
		var sample = getElement('sample').val();
		localStorage.setItem('regex.pattern', pattern)
		localStorage.setItem('regex.sample', sample);
	}

	{
		var pattern = localStorage.getItem('regex.pattern') || 'w(h)?';
		var sample = localStorage.getItem('regex.sample') ||
			'Ignorance is the curse of God; knowledge is the wing wherewith we fly to heaven.';
		getElement('pattern').val(pattern);
		getElement('sample').val(sample);
		getElement('pattern').keyup(testRegex);
		getElement('sample').keyup(testRegex);
		getElement('pattern').blur(saveToLocalStorage);
		getElement('sample').blur(saveToLocalStorage);
		testRegex();
	}
});
