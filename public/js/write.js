require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"URL" : "../common/url"
	}
});

define(['iAlert', 'URL'], function(iAlert, URL) {

	function responsive() {
		var rWidth = window.innerWidth - $('.left.column').width() - $('.middle.column').width() - $('.sidebar').width();
		$('.right.column').css('width', rWidth + 'px');
	}

	responsive();
	$(window).resize(function() {
		responsive();
	});

	// left column
	// =========================================
	var $newNotebookBtn = $('.new-notebook-btn');
	var $newNotebookForm = $('.new-notebook-form');
	var $newNotebookInput = $newNotebookForm.find('input');
	var $notebooks = $('.notebooks.list');
	// 点击“新建文集”按钮
	$newNotebookBtn.on('click', function() {
		$newNotebookForm.slideDown();
		$newNotebookInput.val('');
	});
	// 点击“取消”按钮
	$newNotebookForm.on('click', '.cancel', function() {
		$newNotebookForm.slideUp();
	});

	// 返回文集Item模板
	function notebookItem(notebook, active) {
		var temp;
		if (active) {
			temp = '<a class="active item" href="/write#/notebook/' + notebook._id + '" data-id="' + notebook._id + '">';
		} else {
			temp = '<a class="item" href="/write#/notebook/' + notebook._id + '" data-id="' + notebook._id + '">';
		}
		temp += '<i class="edit icon"></i><i class="book icon"></i>';
		temp += '<div class="content ellipsis" title="' + notebook.name + '">' + notebook.name + '</div></a>';
		return temp;
	}

	// 点击“提交”按钮
	$newNotebookForm.on('click', '.submit', function() {
		var name = $newNotebookInput.val().trim();
		if (!name) {
			iAlert("请输入文集名");
			return;
		}
		$.ajax({
			url : '/api/notebooks',
			type : 'POST',
			data : {
				name : name
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					$newNotebookForm.slideUp();
					$newNotebookInput.val('');
					$notebooks.find('.active.item').removeClass('active');
					$('.middle .articles .item').remove();
					$('.right .mask').show();
					var notebook = data.notebook;
					window.location.href = '/write#/notebook/' + notebook._id;
					var temp = notebookItem(notebook, true);
					$notebooks.prepend($(temp));
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	});

	function renderNotebooks(notebooks) {
		var len = notebooks.length;
		for (var i = 0; i < len; i++) {
			$notebooks.append($(notebookItem(notebooks[i])));
		}
	}

	// 查找我的所有文集
	function findAllNotebooks(callback) {
		$.ajax({
			url : '/api/notebooks/mine',
			type : 'GET',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					renderNotebooks(data.notebooks);
					callback();
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	}

	// 选中某个文集时事件处理
	$notebooks.on('click', '.item', function() {
		$('.notebooks .active.item').removeClass('active');
		$(this).addClass('active');
		$(".middle .articles .item").remove();
		var notebookId = $(this).attr('data-id');
		findAllArticleByNotebookId(notebookId, function(articles) {
			if (articles.length !== 0) {
				var $firstArticle = $($('.middle .articles .item')[0]);
				$firstArticle.addClass('active');
				var articleId = $firstArticle.attr('data-id');
				changeEditArticle(articleId);
				$('.right .mask').hide();
			} else {
				$('.right .mask').show();
			}
		});
	});

	findAllNotebooks(function() {
		var parsedObj = URL.parse(window.location.href);
		var hash = parsedObj.hash.slice(2);
		var notebookId;

		if (hash === "") {// 写文章默认Url地址
			var $firstNotebook = $($('.left .notebooks .item')[0]);
			$firstNotebook.addClass('active');
			notebookId = $firstNotebook.attr('data-id');
			findAllArticleByNotebookId(notebookId, function(articles) {
				if (articles.length !== 0) {
					var $firstArticle = $($('.middle .articles .item')[0]);
					$firstArticle.addClass('active');
					var articleId = $firstArticle.attr('data-id');
					changeEditArticle(articleId);
					$('.right .mask').hide();
				} else {
					$('.right .mask').show();
				}
			});
		} else {
			var hashArr = hash.split("/");
			notebookId = hashArr[1];
			var $activeNotebookItem = $('.left .notebooks .item[data-id="' + notebookId + '"]');
				$activeNotebookItem.addClass('active');
			if (hashArr.length === 2) {// 选中了某个文集
				findAllArticleByNotebookId(notebookId, function(articles) {
					if (articles.length !== 0) {
						var $firstArticle = $($('.middle .articles .item')[0]);
						$firstArticle.addClass('active');
						var articleId = $firstArticle.attr('data-id');
						changeEditArticle(articleId);
						$('.right .mask').hide();
					} else {
						$('.right .mask').show();
					}
				});
			} else if (hashArr.length === 4) {// 选中了某个文集并且选中了某篇文章
				var articleId = hashArr[3];
				findAllArticleByNotebookId(notebookId, function(articles) {
					if (articles.length !== 0) {
						var $activeArticleItem = $('.middle .articles .item[data-id="' + articleId + '"]');
						$activeArticleItem.addClass('active');
						changeEditArticle(articleId);
						$('.right .mask').hide();
					} else {
						$('.right .mask').show();
					}
				});
			}
		}
	});

	// 文集 - 编辑
	$('.left .notebooks').on('click', '.edit', function() {
		var $item = $(this).parents('.item');
		var notebookId = $item.attr('data-id');
		$('#updateNotebookModal').find('input').val($item.find('.content').html());
		$('#updateNotebookModal').modal({
			onApprove : function() {
				var name = $(this).find('input').val().trim();
				$.ajax({
					url : '/api/notebooks/' + notebookId,
					type : 'PUT',
					data : {
						name : name
					},
					dataType : 'json',
					timeout : 15000,
					success : function(data) {
						console.log(data);
						if (data.r === 0) {
							iAlert(data.msg);
							$item.find('.content').html(data.notebook.name);
						} else {
							iAlert(data.msg);
							return;
						}
					}
				});
			}
		}).modal('show');
		return false;
	});

	// 文集 - 删除
	$('.left .notebooks').on('click', '.trash', function() {
		var $item = $(this).parents('.item');
		var notebookId = $item.attr('data-id');

		$('#deleteNotebookModal').modal({
			onApprove : function() {
				$.ajax({
					url : '/api/notebooks/' + notebookId,
					type : 'DELETE',
					timeout : 15000,
					success : function(data) {
						console.log(data);
						if (data.r === 0) {
							iAlert(data.msg);
							$item.remove();
							window.location.href = '/write#/';
							$($('.notebooks .item')[0]).click();
						} else {
							iAlert(data.msg);
							return;
						}
					}
				});
			}
		}).modal('show');
		return false;
	});

	// middle column
	// =========================================
	var $articles = $('.articles.list');
	// 返回文章Item模板
	function articleItem(notebookId, article) {
		var temp = '<a class="item" href="/write#/notebook/' + notebookId + '/article/' + article._id + '" data-id="' + article._id + '">';
		temp += '<i class="trash icon"></i><!--<i class="setting icon"></i>--><i class="file large icon"></i>';
		temp += '<div class="content">';
		temp += '<div class="header ellipsis">' + article.title + '</div>';
		if (!article.intro) {
			temp += '<p class="ellipsis">&nbsp;</p>';
		} else {
			temp += '<p class="ellipsis">' + article.intro + '</p>';
		}
		temp += '</div></a>';
		return temp;
	}

	var allArticles = window.allArticles = {};

	function renderArticles(notebookId, articles) {
		var len = articles.length;
		var article;
		var temp;
		for (var i = 0; i < len; i++) {
			article = articles[i];
			allArticles[article._id] = article;
			temp = articleItem(notebookId, article);
			$articles.append($(temp));
		}
	}

	// 查找某个文集下面的所有文章
	function findAllArticleByNotebookId(notebookId, callback) {
		$.ajax({
			url : '/api/notebook/' + notebookId + '/articles',
			type : 'GET',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					renderArticles(notebookId, data.articles);
					callback(data.articles);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	}

	// 新建文章
	$('.new-article-btn').on('click', function() {
		var notebookId = $('.left .notebooks .active.item').attr('data-id');
		$.ajax({
			url : '/api/articles',
			type : 'POST',
			data : {
				notebookId : notebookId
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					var article = data.article;
					$('.middle .articles .active.item').removeClass('active');
					window.location.href = '/write#/notebook/' + notebookId + '/article/' + article._id;
					allArticles[article._id] = article;
					var temp = articleItem(notebookId, article);
					$('.articles.list').prepend($(temp));
					$('.middle .articles .item[data-id="' + article._id + '"]').addClass('active');
					changeEditArticle(article._id);
					$('.right .mask').hide();
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	});

	// 选中某篇文章
	$('.middle .articles').on('click', '.item', function() {
		var articleId = $(this).attr('data-id');
		$('.middle .articles .active.item').removeClass('active');
		$(this).addClass('active');
		changeEditArticle(articleId);
	});

	// 删除文章
	$('.middle .articles').on('click', '.trash', function() {
		var $item = $(this).parents('.item');
		var articleId = $item.attr('data-id');

		$('#deleteArticleModal').modal({
			onApprove : function() {
				$.ajax({
					url : '/api/articles/' + articleId,
					type : 'DELETE',
					timeout : 15000,
					success : function(data) {
						console.log(data);
						if (data.r === 0) {
							iAlert(data.msg);
							$('.notebooks .active.item').click();
							var notebookId = $('.notebooks .active.item').attr('data-id');
							window.location.href = '/write#/notebook/' + notebookId;
							$item.remove();
						} else {
							iAlert(data.msg);
							return;
						}
					}
				});
			}
		}).modal('show');
		return false;
	});

	// 设置文章
	$('.middle .articles').on('click', '.setting', function() {

		return false;
	});

	// right column
	// =========================================

	$('.toolbar .popup').popup();
	var editorHeight = $('.right.column').height() - 98;

	var opts = {
		container : 'epiceditor',
		textarea : null,
		basePath : 'epiceditor',
		clientSideStorage : true,
		localStorageName : 'epiceditor',
		useNativeFullscreen : false,
		parser : marked,
		file : {
			name : 'epiceditor',
			defaultContent : '',
			autoSave : 100
		},
		theme : {
			base : '/themes/base/epiceditor.css',
			preview : '/themes/preview/github.css',
			editor : '/themes/editor/epic-light.css'
		},
		button : {
			preview : false,
			fullscreen : false,
			bar : "auto"
		},
		focusOnLoad : false,
		shortcut : {
			modifier : 18,
			fullscreen : 70,
			preview : 80
		},
		string : {
			togglePreview : '切换预览模式',
			toggleEdit : '切换编辑模式',
			toggleFullscreen : '全屏'
		},
		autogrow : {
			minHeight : editorHeight,
			maxHeight : editorHeight,
			scroll : true
		}
	};

	var editor = window.editor = new EpicEditor(opts).load();

	function changeEditArticle(articleId) {
		var article = allArticles[articleId];
		if (article.status === 0) {
			$('#publishBtn').show();
			$('#unPublishBtn').hide();
		} else {
			$('#unPublishBtn').show();
			$('#publishBtn').hide();
		}
		$('.right .title').val(article.title);
		editor.importFile(article._id, article.content);
	}

	// 全屏
	$('.toolbar li.fullscreen').on('click', function() {
		editor.enterFullscreen();
	});

	// 预览模式
	$('.toolbar').on('click', 'li.preview', function() {
		$(this).attr('data-content', '切换编辑模式');
		$(this).removeClass('preview');
		$(this).addClass('edit');
		$(this).find('i').removeClass('unhide');
		$(this).find('i').addClass('hide');
		editor.preview();
	});

	// 编辑模式
	$('.toolbar').on('click', 'li.edit', function() {
		$(this).attr('data-content', '切换预览模式');
		$(this).removeClass('edit');
		$(this).addClass('preview');
		$(this).find('i').removeClass('hide');
		$(this).find('i').addClass('unhide');
		editor.edit();
	});

	// 保存
	$('.toolbar').on('click', 'li.save', function() {
		var title = $('.right input').val().trim();
		if (!title) {
			iAlert('文章标题不能为空');
			return;
		}
		var content = editor.exportFile();
		var raw = content.replace(/```|(#+)|\n|\s/g, '');
		var wordsNum = raw.length;
		var articleId = $('.middle .articles .active.item').attr('data-id');
		var intro = raw.slice(0, 200);
		var diffNum = wordsNum - allArticles[articleId].wordsNum;

		$.ajax({
			url : '/api/articles/' + articleId,
			type : 'PUT',
			data : {
				title : title,
				content : content,
				intro : intro,
				wordsNum : wordsNum,
				diffNum : diffNum
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					allArticles[data.article._id] = data.article;
					iAlert(data.msg);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	});

	$('.right .title').on('keyup', function() {
		var title = $(this).val();
		$('.articles .active.item').find('.header').html(title);
	});

	$('#unPublishBtn').on('mouseover', function() {
		$(this).html('<i class="icon remove"></i>取消发布');
	}).on('mouseout', function() {
		$(this).html('<i class="icon checkmark"></i>已发布');
	});

	function updateArticleStatusById(articleId, status, succCall) {
		$.ajax({
			url : '/api/articles/' + articleId + '/status',
			type : 'PUT',
			data : {
				status : status
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert(data.msg);
					succCall();
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
	}

	// 取消发布
	$('.toolbar').on('click', '#unPublishBtn', function() {
		var articleId = $('.articles .active.item').attr('data-id');
		updateArticleStatusById(articleId, 0, function() {
			// 取消发布成功
			$('#publishBtn').show();
			$('#unPublishBtn').hide();
			allArticles[articleId].status = 0;
		});
	});

	// 发布文章
	$('.toolbar').on('click', '#publishBtn', function() {
		var articleId = $('.articles .active.item').attr('data-id');
		updateArticleStatusById(articleId, 1, function() {
			// 发布成功
			$('#publishBtn').hide();
			$('#unPublishBtn').show();
			allArticles[articleId].status = 1;
		});
	});

});
