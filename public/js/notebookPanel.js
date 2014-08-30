require.config({
	paths : {
		"iAlert" : "../common/iAlert"
	}
});

define('notebookPanel',['iAlert'], function(iAlert) {
	
	// 订阅
	$('.ui.buttons').on('click', '.subBtn', function() {
		var that = this;
		var notebookId = $(this).attr('data-id');

		$.ajax({
			url : '/api/notebooks/' + notebookId + '/sub',
			type : 'POST',
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					$(that).addClass('red unSubBtn').removeClass('subBtn');
					$(that).html('<i class="icon checkmark"></i>正在订阅');
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	});
	
	// 鼠标移上“正在订阅”按钮
	$('.ui.buttons').on('mouseover', '.unSubBtn', function() {
		$(this).html('<i class="icon remove"></i>取消订阅');
	}).on('mouseout', '.unSubBtn', function() {
		$(this).html('<i class="icon checkmark"></i>正在订阅');
	});
	
	// 取消订阅
	$('.ui.buttons').on('click', '.unSubBtn', function() {
		var that = this;
		var notebookId = $(this).attr('data-id');

		$.ajax({
			url : '/api/notebooks/' + notebookId + '/unSub',
			type : 'DELETE',
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					$(that).addClass('subBtn').removeClass('red unSubBtn');
					$(that).html('<i class="icon add"></i>添加订阅');
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	});
	
});