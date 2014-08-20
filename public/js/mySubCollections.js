require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"Collection" : "./collection"
	}
});

define(['Collection', 'iAlert'], function(Collection, iAlert) {

	var $tip = $('.tip');

	// 查询我订阅的所有专题
	$.ajax({
		url : '/api/collections/sub',
		type : 'GET',
		dataType : 'json',
		timeout : 15000,
		success : function(data) {
			console.log(data);
			if (data.r === 0) {
				if (data.collections.length === 0) {
					$tip.show();
				} else {
					Collection.render(data.collections);
				}
			} else {
				iAlert(data.msg);
				return;
			}
		}
	});

});
