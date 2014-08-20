require.config({
	paths : {
		"iAlert" : "../common/iAlert"
	}
});

define('Collection',['iAlert'], function(iAlert) {

	var $collectionList = $('#collectionList');

	function renderOne(collection) {
		var temp = '<a class="item collection" href="/collections/' + collection._id + '" data-id="' + collection._id + '">';
		temp += '<div class="ui rounded image"><img src="' + collection.mThumbnailUrl + '"></div>';
		temp += '<div class="content"><div class="name">' + collection.name + '</div>';
		temp += '<p class="description ellipsis">' + collection.description + '</p></div>';
		if (collection.hasSub) {// 已经订阅
			temp += '<div class="ui circular mini red button unSubBtn" data-num="' + collection.subscriptionsNum + '"><i class="checkmark icon"></i>正在订阅 | ' + collection.subscriptionsNum + '</div></a>';
		} else {
			temp += '<div class="ui circular mini button subBtn" data-num="' + collection.subscriptionsNum + '"><i class="add icon"></i>添加订阅 | ' + collection.subscriptionsNum + '</div></a>';
		}
		$collectionList.append($(temp));
	}

	function render(collections) {
		var len = collections.length;
		for (var i = 0; i < len; i++) {
			renderOne(collections[i]);
		}
	}
	
	// 鼠标以上正在订阅按钮
	$collectionList.on('mouseover', '.unSubBtn', function() {
		var num = $(this).attr('data-num');
		$(this).html('<i class="icon remove"></i>取消订阅 | ' + num);
	}).on('mouseout', '.unSubBtn', function() {
		var num = $(this).attr('data-num');
		$(this).html('<i class="icon checkmark"></i>正在订阅 | ' + num);
	});
	
	// 取消订阅
	$('#collectionList').on('click', '.unSubBtn', function() {
		var that = this;
		var collectionId = $(this).parents('.collection').attr('data-id');

		$.ajax({
			url : '/api/collections/' + collectionId + '/unSub',
			type : 'DELETE',
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					$(that).addClass('subBtn').removeClass('red unSubBtn');
					var num = Number($(that).attr('data-num')) - 1;
					$(that).attr('data-num', num);
					$(that).html('<i class="add icon"></i>添加订阅 | ' + num);
					iAlert(data.msg);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
		return false;
	});

	// 订阅
	$('#collectionList').on('click', '.subBtn', function() {
		var that = this;
		var collectionId = $(this).parents('.collection').attr('data-id');

		$.ajax({
			url : '/api/collections/' + collectionId + '/sub',
			type : 'POST',
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					$(that).addClass('red unSubBtn').removeClass('subBtn');
					var num = Number($(that).attr('data-num')) + 1;
					$(that).attr('data-num', num);
					$(that).html('<i class="remove icon"></i>取消订阅 | ' + num);
					iAlert(data.msg);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});
		return false;
	});
	

	return {
		render : render
	}

});
