require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"Collection" : "./collection"
	}
});

define(['Collection', 'iAlert'], function(Collection, iAlert) {

	// 查询我创建的所有专题
	$.ajax({
		url : '/api/collections/mine',
		type : 'GET',
		dataType : 'json',
		timeout : 15000,
		success : function(data) {
			console.log(data);
			if (data.r === 0) {
				Collection.render(data.collections);
			} else {
				iAlert(data.msg);
				return;
			}
		}
	});

});
