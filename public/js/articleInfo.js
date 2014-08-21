require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"Util" : "../common/util"
	}
});

define(['iAlert', 'Util'], function(iAlert, Util) {

	// 生成文章地址二维码图片
	$('#articleQrcode').qrcode({
		width : 150,
		height : 150,
		text : window.location.href
	});

	// 喜欢
	function likeArticle(articleId, callback) {
		$.ajax({
			url : '/api/articles/' + articleId + '/like',
			method : 'post',
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert(data.msg);
				}
			}
		});
	}

	// 取消喜欢
	function unLikeArticle(articleId, callback) {
		$.ajax({
			url : '/api/articles/' + articleId + '/unLike',
			method : 'DELETE',
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert(data.msg);
				}
			}
		});
	}

	// 喜欢
	$('.main .left').on('click', '.likeBtn', function() {
		var me = this;
		var articleId = $(me).attr('data-articleid');
		likeArticle(articleId, function(data) {
			$(me).removeClass('likeBtn').addClass('red unLikeBtn');
		});
	});

	// 取消喜欢
	$('.main .left').on('click', '.unLikeBtn', function() {
		var me = this;
		var articleId = $(me).attr('data-articleid');
		unLikeArticle(articleId, function(data) {
			$(me).removeClass('unLikeBtn red').addClass('likeBtn');
		});
	});

	function showPopup() {
		var left = $('.includeBtn').offset().left - $('.includeBtn').width() - 10;
		var top = $('.includeBtn').offset().top + $('.includeBtn').height() * 2.7;
		$('.myCollections.popup').css({
			left : left,
			top : top
		});
		$('.myCollections.popup').addClass('visible');
		$('.myCollections .list').html('');
	}

	function hidePopup() {
		$('.myCollections.popup').removeClass('visible');
	}

	// 收录
	$('.main .left').on('click', '.includeBtn', function() {
		var me = this;
		var articleId = $(me).attr('data-articleid');

		if ($('.myCollections.popup').hasClass('visible')) {
			hidePopup();
		} else {
			showPopup();

			// 我创建的所有专题，并且返回当前文章是否已经收录信息
			$.ajax({
				url : '/api/collections/mine/with',
				type : 'GET',
				data : {
					articleId : articleId
				},
				dataType : 'json',
				timeout : 15000,
				success : function(data) {
					console.log(data);
					if (data.r === 0) {
						var collections = data.collections;
						var len = collections.length;
						if (len !== 0) {
							for (var i = 0; i < len; i++) {
								var html = '<div class="item" data-id="' + collections[i]._id + '" data-hasAdd="' + collections[i].hasAdd + '">';
								if (collections[i].hasAdd) {
									html += '<a class="right floated cancel" title="取消收录">取消</a>';
								} else {
									html += '<a class="right floated cancel hide" title="取消收录">取消</a>';
								}
								html += '<img class="ui avatar image" src="' + collections[i].sThumbnailUrl + '">';
								html += '<div class="content">';
								html += '<div class="header name">' + collections[i].name + '</div>';
								html += '</div></div>';
								$('.myCollections .list').append($(html));
							}
						} else {
							var html = '<div class="ui red header">您还未创建过任何专题，不能收录！马上去创建一个？</div>';
							html += '<a class="ui button mini green" href="/collections/new" style="color:#fff;" target="_blank">马上创建</a>';
							$('.myCollections .list').append($(html));
						}
					} else {
						iAlert(data.msg);
						return;
					}
				}
			});
		}
	});

	$('.myCollections.popup').on('click', '.close', function() {
		hidePopup();
	});

	// 确定收录
	$('.myCollections.popup .list').on('click', '.name.header', function() {
		var articleId = $('#title').attr('data-id');
		var collectionId = $(this).parents('.item').attr('data-id');
		var hasAdd = $(this).parents('.item').attr('data-hasAdd');
		var me = this;
		// 已经收录
		if (hasAdd === 'true') {
			return;
		}
		$.ajax({
			url : '/api/articles/' + articleId + '/add',
			method : 'post',
			data : {
				collectionId : collectionId
			},
			dataType : 'json',
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert('收录成功');
					$(me).parents('.item').attr('data-hasAdd', true);
					$(me).parents('.item').find('a').removeClass('hide');
				} else {
					iAlert(data.msg);
				}
			}
		});
	});

	// 取消收录
	$('.myCollections.popup .list').on('click', '.cancel', function() {
		var articleId = $('#title').attr('data-id');
		var collectionId = $(this).parents('.item').attr('data-id');
		var me = this;

		$.ajax({
			url : '/api/articles/' + articleId + '/unAdd',
			method : 'DELETE',
			data : {
				collectionId : collectionId
			},
			dataType : 'json',
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert('取消收录成功');
					$(me).parents('.item').attr('data-hasAdd', false);
					$(me).addClass('hide');
				} else {
					iAlert(data.msg);
				}
			}
		});
	});

	function findByArticleIdAndPage(articleId, config, callback) {
		$.ajax({
			url : '/api/articles/' + articleId + '/likes',
			method : 'GET',
			data : config,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					callback(data);
				} else {
					iAlert(data.msg);
				}
			}
		});
	}

	function renderOne(articleLike) {
		var temp = '<div class="event">';
		if (articleLike.sHeadimgurl) {
			temp += '<img class="ui avatar image" src="' + articleLike.sHeadimgurl + '">';
		} else {
			temp += '<img class="ui avatar image" src="/img/default_avatar.png">';
		}
		temp += '<div class="content">';
		temp += '<div class="summary">';
		temp += '<a>' + articleLike.nickname + '</a>';
		temp += ' 大约 ' + Util.convertDate(articleLike.createTime) + ' 喜欢了这篇文章';
		temp += '</div></div></div>';
		$('.footer .tabItem[data-id="4"] ul').append($(temp));
	}

	function render(articleLikes) {
		var len = articleLikes.length;
		for (var i = 0; i < len; i++) {
			renderOne(articleLikes[i]);
		}
	}

	var queryConfig = {
		pageSize : 10,
		pageStart : 0
	};

	var articleId = $('#title').attr('data-id');

	findByArticleIdAndPage(articleId, queryConfig, function(data) {
		render(data.articleLikes);
		queryConfig.pageStart += data.articleLikes.length;
	});

	$('#loadMore').on('click', function() {
		findByArticleIdAndPage(articleId, queryConfig, function(data) {
			var articleLikes = data.articleLikes;
			var len = articleLikes.length;

			if (len === 0) {
				$('#loadMore').html('无更多记录');
			} else if (len < queryConfig.pageSize) {
				$('#loadMore').html('无更多记录');
				queryConfig.pageStart += len;
				render(articleLikes);
			} else if (len === queryConfig.pageSize) {
				$('#loadMore').html('查看更多<i class="icon double angle down"></i>');
				queryConfig.pageStart += len;
				render(articleLikes);
			}
		});
	});

	$('#tabMenu').on('click', '.item', function(e) {
		$('#tabMenu .item').removeClass('active');
		$(this).addClass('active');
		var index = $(this).attr('data-id');
		$('.tabItem').addClass('hide');
		$('.tabItem[data-id="' + index + '"]').removeClass('hide');
	});

});
