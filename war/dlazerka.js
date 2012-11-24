$(function() {
	$('#nav li').click(function(event) {
		location.href = $('a', event.target).attr('href');
	});
});