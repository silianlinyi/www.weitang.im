require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util",
		"collectionPanel": "./collectionPanel"
	}
});

define(['iAlert', 'Util', 'collectionPanel'], function(iAlert, Util, collectionPanel) {

	function findSubscribers(collectionId, config, callback) {
		$.ajax({
			url: '/api/collections/' + collectionId + '/subscribers',
			method: 'GET',
			data: config,
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert(data.msg);
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

		$userList.append($(html));
	}

	function render(users) {
		var len = users.length;
		for (var i = 0; i < len; i++) {
			renderOne(users[i]);
		}
	}

	var collectionId = GNS.collection._id;
	var config = {
		pageSize: 20,
		pageStart: 0
	};
	
	var $userList = $('#userList');
	var $loadMore = $('#loadMore');
	
	findSubscribers(collectionId, config, function(data) {
		if (data.users.length === config.pageSize) {
			$loadMore.show();
		}
		render(data.users);
		config.pageStart += data.users.length;
	});
	
	$loadMore.click(function() {
		$loadMore.html('正在加载...');
		findSubscribers(collectionId, config, function(data) {
			var users = data.users;
			var len = users.length;
			if (len === 0) {
				$loadMore.html('无更多订阅者');
			} else if (len < config.pageSize) {
				$loadMore.html('无更多订阅者');
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