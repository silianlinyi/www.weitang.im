require.config({
	paths : {
		"iAlert" : "../common/iAlert"
	}
});

define(['iAlert'], function(iAlert) {

	// 删除数组的某个元素
	Array.prototype.remove = function(itemToRemove) {
		return this.filter(function(element) {
			return element !== itemToRemove;
		});
	};
	var uploader = Qiniu.uploader({
		runtimes : 'html5,flash,html4',
		browse_button : 'pickfiles',
		uptoken_url : '/api/qiniu/uptoken',
		unique_names : true,
		domain : GNS.QINIU_Domain,
		container : 'container',
		max_file_size : '4mb',
		flash_swf_url : '../plupload/Moxie.swf',
		max_retries : 3,
		dragdrop : true,
		drop_element : 'container',
		chunk_size : '4mb',
		auto_start : true,

		init : {
			'BeforeUpload' : function(up, file) {
				// 每个文件上传前,处理相关的事情
				console.log('BeforeUpload');
			},
			'FilesAdded' : function(up, files) {
				console.log('FilesAdded');
				plupload.each(files, function(file) {
					// 文件添加进队列后,处理相关的事情
				});
			},
			'UploadProgress' : function(up, file) {
				// 每个文件上传时,处理相关的事情
				var percent = file.percent;
				console.log(percent);
				$('#pickfiles').html('正在上传...' + percent + '%');
			},
			'FileUploaded' : function(up, file, info) {
				// 每个文件上传成功后,处理相关的事情
				// 其中 info 是文件上传成功后，服务端返回的json，形式如
				// {
				//    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
				//    "key": "gogopher.jpg"
				//  }
				// 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
				var domain = up.getOption('domain');
				var res = JSON.parse(info);
				sourceUrl = domain + res.key;
				mThumbnailUrl = Qiniu.imageView2({
					mode : 1,
					w : 250,
					h : 150,
					q : 100,
					format : 'jpg'
				}, res.key);
				sThumbnailUrl = Qiniu.imageView2({
					mode : 1,
					w : 100,
					h : 80,
					q : 100,
					format : 'jpg'
				}, res.key);
				console.log(sourceUrl);
				console.log(mThumbnailUrl);
				console.log(sThumbnailUrl);
				$('#pickfiles').html('上传封面图片');
				$('.collection .image').html('<img src="' + mThumbnailUrl + '" height="180" style="height:180px;">');
			},
			'UploadComplete' : function() {
				//队列文件处理完毕后,处理相关的事情
				console.log('UploadComplete');
			},
			'Error' : function(up, err, errTip) {
				//上传出错时,处理相关的事情
				console.log('Error');
			}
		}
	});

	$('#name').on('keyup', function() {
		var name = $('#name').val().trim();
		$('.collection .name').html(name);
	});

	$('#description').on('keyup', function() {
		var description = $('#description').val().trim();
		$('.collection .description').html(description);
	});

	var sourceUrl = '';
	var mThumbnailUrl = '';
	var sThumbnailUrl = '';
	var tags = [];

	// 添加标签
	$('#addTagBtn').on('click', function() {
		var tag = $('#tag').val().trim();
		if (!tag) {
			return;
		}
		if (tags.length === 5) {
			iAlert('每个专题最多只能添加5个标签');
			return;
		}
		tags.push(tag);
		var temp = '<div class="ui label" data-tag="' + tag + '">' + tag + '<i class="delete icon"></i></div>';
		$('#tagList').append($(temp));
		$('#tag').val('');
	});

	// 删除标签
	$('#tagList').on('click', '.delete', function() {
		var tag = $(this).parents('.label').attr('data-tag');
		$(this).parents('.label').remove();
		tags = tags.remove(tag);
	});

	// 创建专题
	$('#createBtn').on('click', function() {
		var name = $('#name').val().trim();
		var description = $('#description').val();

		if (!name) {
			iAlert('专题名不能为空');
			return;
		}
		if (!description) {
			iAlert('专题描述不能为空');
			return;
		}
		if (!sourceUrl) {
			iAlert('请上传一张专题封面');
			return;
		}
		if (tags.length === 0) {
			iAlert('一个专题至少包含一个标签');
			return;
		}
		if (name.length > 20) {
			iAlert('专题名长度不超过20个字');
			return;
		}
		if (description.length > 100) {
			iAlert('专题描述长度不超过100个字');
			return;
		}

		$.ajax({
			url : '/api/collections',
			type : 'POST',
			data : {
				name : name,
				description : description,
				sourceUrl : sourceUrl,
				mThumbnailUrl : mThumbnailUrl,
				sThumbnailUrl : sThumbnailUrl,
				tags : tags
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert(data.msg);
					setTimeout(function() {
						window.location.href = '/collections/mine';
					}, 1000);
				} else {
					iAlert(data.msg);
					return;
				}
			}
		});

	});

});
