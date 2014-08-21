require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util"
	}
});

define(['iAlert', 'Util'], function(iAlert, Util) {

	function findMessagesByPage(config, callback) {
		$.ajax({
			url: '/api/messages',
			type: 'GET',
			data: {
				fromUser: config.fromUser,
				pageSize: config.pageSize,
				pageStart: config.pageStart
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	}

	function renderOne(message) {
		var sHeadimgurl = message.toUser.sHeadimgurl || "/img/default_avatar.png";
		var html = '<tr>';
		html += '<td><img src="' + sHeadimgurl + '" class="ui image avatar" />' + message.toUser.nickname + '</td>';
		html += '<td><a href="/messages/' + message._id + '">' + message.topic + '</a></td>';
		html += '<td>' + Util.convertDate(message.createTime) + '</td>';
		html += '</tr>';
		$(".ui.table tbody").append($(html));
	}

	function render(messages) {
		var len = messages.length;
		for (var i = 0; i < len; i++) {
			renderOne(messages[i]);
		}
	}

	var $loadMore = $('#loadMore');

	var config = {
		fromUser: user._id,
		pageSize: 10,
		pageStart: 0
	};

	findMessagesByPage(config, function(data) {
		var messages = data.messages;
		var len = messages.length;
		if (len === 0) {

		} else if (len < config.pageSize) {
			render(messages);
			config.pageStart += len;
		} else if (len === config.pageSize) {
			render(messages);
			config.pageStart += len;
			$('#loadMore').show();
		}
	});

	$loadMore.on('click', function() {
		$loadMore.html('正在加载...');
		findMessagesByPage(config, function(data) {
			var messages = data.messages;
			var len = messages.length;
			if (len === 0) {
				$loadMore.html('无更多私信');
			} else if (len < config.pageSize) {
				render(messages);
				config.pageStart += len;
				$loadMore.html('无更多私信');
			} else if (len === config.pageSize) {
				render(messages);
				config.pageStart += len;
				$loadMore.html('加载更多');
			}
		});
	});

});