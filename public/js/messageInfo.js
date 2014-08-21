require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util"
	}
});

define(['iAlert', 'Util'], function(iAlert, Util) {

	$('.delete.button').click(function() {
		if (confirm('你确定要删除这条私信吗？')) {
			var _id = $('.ui.header[data-id]').attr('data-id');
			$.ajax({
				url: '/api/messages/' + _id,
				type: 'DELETE',
				timeout: 15000,
				success: function(data) {
					console.log(data);
					if (data.r === 0) {
						window.history.back();
					} else {
						iAlert(data.msg);
						return;
					}
				}
			});
		}
	});

});