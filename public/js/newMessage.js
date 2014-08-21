require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util"
	}
});

define(['iAlert', 'Util'], function(iAlert, Util) {
	var editor = window.editor = new Editor();
	editor.render();

	function newMessage(params) {
		$.ajax({
			url: '/api/messages',
			type: 'POST',
			data: params,
			dataType: 'json',
			timeout: 15000,
			success: function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert('发送成功');
					setTimeout(function() {
						window.location.href = "/messages/sent";
					}, 1500);
				} else {
					iAlert(data.msg);
				}
			}
		});
	}

	// 发送
	$('.sendBtn.button').on('click', function() {
		var toUser = $('#toUser').val().trim();
		var topic = $('#topic').val().trim();
		var content = editor.codemirror.getValue();
		if (!toUser) {
			iAlert('收件人邮箱不能为空');
			return;
		}
		if (!topic) {
			iAlert('主题不能为空');
			return;
		}

		newMessage({
			toUser: toUser,
			topic: topic,
			content: content
		});
	});

	// 取消
	$('.cancel.button').on('click', function() {
		window.history.back()
	});

});