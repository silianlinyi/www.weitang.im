require.config({
	paths : {
		"iAlert" : "../common/iAlert"
	}
});

define(['iAlert'], function(iAlert) {

	function renderOne(article) {
		var temp = '<li><div class="article">';
		temp += '<a href="/articles/' + article._id + '" class="ui left floated header" target="_blank">' + article.title + '</a>';
		temp += '<a href="/users/' + article.belongToUserId._id + '/latestArticles">';
		temp += '<img src="' + article.belongToUserId.sHeadimgurl + '" data-content="' + article.belongToUserId.nickname + '" data-variation="inverted" data-position="bottom center" class="circular right floated mini ui image">';
		temp += '</a><br class="clearfix" />';
		temp += '<a href="/articles/' + article._id + '" class="content" target="_blank">' + article.intro + '</a>';
		temp += '<div class="article-info">';
		temp += '<i class="book black small icon"></i>';
		temp += '<a class="notebook" href="/notebooks/' + article.belongToNotebookId._id + '" target="_blank">' + article.belongToNotebookId.name + '</a>&nbsp;';

		var len = article.belongToCollectionIds.length;
		// 只显示前3个专题信息
		len = len > 3 ? 3 : len;
		if (len !== 0) {
			temp += '<i class="grid layout black small icon"></i>&nbsp;';
			for (var i = 0; i < len; i++) {
				temp += '<a class="collections" href="/collections/' + article.belongToCollectionIds[i]._id + '">' + article.belongToCollectionIds[i].name + '</a>&nbsp;&nbsp;';
			}
		}

		temp += '<a href="/articles/' + article._id + '#comments" target="_blank">';
		temp += '<i class="icon black chat outline"></i>' + article.commentsNum + '</a>&nbsp;';
		temp += '<a><i class="heart empty black icon"></i>' + article.likesNum + '</a>';
		temp += '</div></div></li>';

		$('#articleList').append($(temp));
		$('.article img').popup();
	}

	function render(articles) {
		var len = articles.length;
		for (var i = 0; i < len; i++) {
			renderOne(articles[i]);
		}
	}

	function findNewest(config, callback) {
		$.ajax({
			url : '/api/articles/newest',
			type : 'GET',
			data : config,
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
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

	var queryConfig = {
		pageSize : 20,
		pageStart : 0
	};

	var $loadMore = $('#loadMore');

	// 默认加载
	findNewest(queryConfig, function(data) {
		var articles = data.articles;
		var len = articles.length;
		queryConfig.pageStart += len;
		render(articles);
	});

	// 点击加载更多
	$loadMore.on('click', function() {
		if ($(this).hasClass('disabled')) {
			return;
		}

		$loadMore.html('正在加载...');
		findNewest(queryConfig, function(data) {
			var articles = data.articles;
			var len = articles.length;
			if (len === 0) {
				$loadMore.html('无更多文章').addClass('disabled');
			} else if (len < queryConfig.pageSize) {
				queryConfig.pageStart += len;
				$loadMore.html('无更多文章').addClass('disabled');
				render(articles);
			} else if (len === queryConfig.pageStart) {
				queryConfig.pageStart += len;
				$loadMore.html('点击查看更多');
				render(articles);
			}
		});
	});

});
