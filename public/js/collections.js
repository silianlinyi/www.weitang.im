require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"Collection" : "./collection"
	}
});

define(['Collection', 'iAlert'], function(Collection, iAlert) {

	var offset = $('.ui.action.input').offset();
	var width = $('.ui.action.input input').width() + 20;
	var height = $('.ui.action.input').height();
	var left = offset.left;
	var top = offset.top + height;

	$('.suggests').css({
		'width' : width,
		'left' : left,
		'top' : top
	});

	var $suggests = $('#suggests');
	var $searchBtn = $('#searchBtn');
	var $loadMore = $('#loadMore');

	function findCollectionsByKey(config, callback) {
		$.ajax({
			url : '/api/collections/search',
			type : 'GET',
			data : config,
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
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
		pageSize : 12,
		pageStart : 0,
		key : ''
	};

	findCollectionsByKey(config, function(data) {
		var collections = data.collections;
		var len = collections.length;
		var count = data.count;

		if (len === 0) {

		} else if (len < config.pageSize) {
			Collection.render(collections);
			config.pageStart += len;
		} else if (len === config.pageSize) {
			Collection.render(collections);
			config.pageStart += len;
			$loadMore.show();
		}
	});

	// 点击“加载更多”按钮
	$loadMore.on('click', function() {
		$loadMore.html('正在加载...');
		findCollectionsByKey(config, function(data) {
			var collections = data.collections;
			var len = collections.length;
			var count = data.count;

			if (len === 0) {
				$loadMore.html('无更多专题');
			} else if (len < config.pageSize) {
				$loadMore.html('无更多专题');
				Collection.render(collections);
				config.pageStart += len;
			} else if (len === config.pageSize) {
				$loadMore.html('加载更多');
				Collection.render(collections);
				config.pageStart += len;
			}
		});
	});

	// 点击“搜索”按钮
	$searchBtn.on('click', function() {
		var key = $('#searchKey').val().trim();
		if (!key) {
			return;
		}
		config.key = key;
		config.pageStart = 0;
		$('#collectionList .item').remove();
		$loadMore.hide();

		findCollectionsByKey(config, function(data) {
			var collections = data.collections;
			var len = collections.length;
			var count = data.count;

			if (len === 0) {

			} else if (len < config.pageSize) {
				Collection.render(collections);
				config.pageStart += len;
			} else if (len === config.pageSize) {
				$loadMore.html('加载更多').show();
				Collection.render(collections);
				config.pageStart += len;
			}
		});
	});

	// 智能搜索下拉框提示
	var smartConfig = {
		pageSize : 7,
		pageStart : 0
	};
	$('#searchKey').on('keyup', function() {
		$('#suggests li').remove();
		smartConfig.key = $(this).val().trim();

		findCollectionsByKey(smartConfig, function(data) {
			var collections = data.collections;
			var len = collections.length;
			var count = data.count;
			if (count === 0) {
				$suggests.hide();
			} else {
				$suggests.show();
				for (var i = 0; i < len; i++) {
					var html = '<li><a href="/collections/' + collections[i]._id + '" target="_blank">' + collections[i].name + '</a></li>';
					$suggests.append($(html));
				}
			}
		});
	});

	$(document).delegate('body', 'click', function() {
		$suggests.hide();
	});

});
