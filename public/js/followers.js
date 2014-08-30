require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util",
		"User": "./user"
	}
});

define(['iAlert', 'Util', 'User'], function(iAlert, Util, User) {

	function findFollowersByPage(followerId, config, callback) {
		$.ajax({
			url: '/api/users/' + followerId + '/followers',
			type: 'GET',
			data: config,
			dataType: 'json',
			timeout: 15000,
			success: function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert('查询失败');
					return;
				}
			}
		});
	}

	function renderOne(user) {
		if (!user.sHeadimgurl) {
			user.sHeadimgurl = '/img/default_avatar.png';
		}
		var html = '<div class="item">';
		html += '<a href="/users/' + user._id + '">';
		html += '<img class="ui avatar image" src="' + user.sHeadimgurl + '">';
		html += '</a>';
		html += '<div class="content">';
		html += '<a class="header" href="/users/' + user._id + '">' + user.nickname + '</a>';
		html += '<div class="ui divided horizontal list">';
		html += '<a class="item" href="/users/' + user._id + '/following">关注 ' + user.followingNum + '</a>';
		html += '<a class="item" href="/users/' + user._id + '/followers">粉丝 ' + user.followersNum + '</a>';
		html += '<a class="item" href="/users/' + user._id + '/latestArticles">文章 ' + user.articlesNum + '</a>';
		html += '<div class="item">文集 ' + user.notebooksNum + '</div>';
		html += '<div class="item">写了' + user.wordsNum + '个字</div>';
		html += '</div></div></div>';

		$('#followerList').append($(html));
	}

	function render(users) {
		var len = users.length;
		for (var i = 0; i < len; i++) {
			renderOne(users[i]);
		}
	}

	var $loadMore = $('#loadMore');

	var config = {
		pageSize: 20,
		pageStart: 0
	};

	var followerId = GNS.u._id;

	findFollowersByPage(followerId, config, function(data) {
		var users = data.users;
		var len = users.length;

		if (len === config.pageSize) {
			$loadMore.show();
		}

		render(users);
		config.pageStart += len;
	});

	$loadMore.click(function() {
		$loadMore.html('正在加载...');

		findFollowersByPage(followerId, config, function(data) {
			var users = data.users;
			var len = users.length;

			if (len === 0) {
				$loadMore.html('无更多粉丝');
			} else if (len < config.pageSize) {
				$loadMore.html('无更多粉丝');
				render(users);
				config.pageStart += len;
			} else if (len === config.pageSize) {
				$loadMore.html('加载更多');
				render(users);
				config.pageStart += len;
			}
		});
	});



});