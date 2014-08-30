require.config({
	paths: {
		"iAlert": "../common/iAlert",
		"Util": "../common/util",
		"User": "./user"
	}
});

define(['iAlert', 'Util', 'User'], function(iAlert, Util, User) {

	var $articleList = $('#articleList');
	var $loadMore = $('#loadMore');

	function renderOne(article) {
		var temp = '<div class="item">';
		temp += '<div class="content">';
		temp += '<a class="ui black header" href="/articles/' + article._id + '">' + article.title + '</a>';
		temp += '<p>' + article.intro + '</p>';
		temp += '</div>';
		temp += '<div class="article-info">';
		temp += '<i class="book black small icon"></i>';
		temp += '<a class="notebook" href="/notebooks/' + article.belongToNotebookId._id + '">' + article.belongToNotebookId.name + '</a>&nbsp;';

		var belongToCollectionIds = article.belongToCollectionIds;
		var len = belongToCollectionIds.length;
		if (len !== 0) {
			temp += '<i class="grid layout black small icon"></i>';
			for (var i = 0; i < len; i++) {
				temp += '<a class="collections" href="/collections/' + belongToCollectionIds[i]._id + '">' + belongToCollectionIds[i].name + '</a>&nbsp;&nbsp;';
			}
			temp += '&nbsp;';
		}
		temp += '<a href="/articles/' + article._id + '#comments" target="_blank">';
		temp += '<i class="icon black chat outline"></i>' + article.commentsNum + '</a>&nbsp;';
		temp += '<a class="like-icon-button"><i class="heart empty black icon"></i>' + article.likesNum + '</a>&nbsp;'
		temp += '<i class="icon small black time"></i>' + Util.convertDate(article.createTime);
		temp += '</div></div>';
		$articleList.append($(temp));
	}

	function render(articles) {
		for (var i = 0; i < articles.length; i++) {
			renderOne(articles[i]);
		}
	}

	function findArticlesByUserIdAndPage(userId, config, callback) {
		$.ajax({
			url: '/api/users/' + userId + '/articles',
			type: 'GET',
			data: config,
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

	var config = {
		pageSize: 15,
		pageStart: 0,
		status: 1,
		sortBy: '-createTime'
	};

	findArticlesByUserIdAndPage(globalNS.u._id, config, function(data) {
		var articles = data.articles;
		var len = articles.length;
		if (len === 0) {

		} else if (len < config.pageSize) {
			render(data.articles);
			config.pageStart += len;
		} else if (len === config.pageSize) {
			render(data.articles);
			config.pageStart += len;
			$loadMore.show();
		}
	});

	$loadMore.on('click', function(e) {
		$loadMore.html('正在加载');

		findArticlesByUserIdAndPage(globalNS.u._id, config, function(data) {
			var articles = data.articles;
			var len = articles.length;
			if (len === 0) {
				$loadMore.html('无更多文章');
			} else if (len < config.pageSize) {
				render(data.articles);
				config.pageStart += len;
				$loadMore.html('无更多文章');
			} else if (len === config.pageSize) {
				render(data.articles);
				config.pageStart += len;
				$loadMore.html('加载更多');
			}
		});
	});

});