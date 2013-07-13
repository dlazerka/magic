$(function() {
	$('#nav li').click(function(event) {
		location.href = $('a', event.target).attr('href');
	});

	$.get('/myip', function(response) {
		$('#myip .body').text(response.addr);
	});
});