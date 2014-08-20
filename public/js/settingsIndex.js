require.config({
	paths : {
		"iAlert" : "../common/iAlert",
		"Util" : "../common/util",
		"area" : "../common/area"
	}
});

define(['iAlert', 'Util', 'area'], function(iAlert, Util, area) {

	"use strict";
    // 头像上传相关代码
	var uploader = Qiniu.uploader({
		runtimes : 'html5,flash,html4',
		browse_button : 'pickfiles',
		uptoken_url : '/api/qiniu/uptoken',
		unique_names : true,
		domain : QINIU_Domain,
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
			},
			'FilesAdded' : function(up, files) {
				plupload.each(files, function(file) {
					// 文件添加进队列后,处理相关的事情
				});
			},
			'UploadProgress' : function(up, file) {
				// 每个文件上传时,处理相关的事情
				var percent = file.percent;
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
				var sourceUrl = domain + res.key;
				var sHeadimgurl = Qiniu.imageView2({
					mode : 1,
					w : 50,
					h : 50,
					q : 100,
					format : 'jpg'
				}, res.key);
				console.log(sourceUrl);
				console.log(sHeadimgurl);
				$('#pickfiles').html('上传头像');
				$('#headimgurl').attr('src', sourceUrl);
				$('#headimgurl').attr('data-headimgurl', sourceUrl);
				$('#headimgurl').attr('data-sHeadimgurl', sHeadimgurl);
			},
			'UploadComplete' : function() {
				//队列文件处理完毕后,处理相关的事情
				console.log('UploadComplete')
			},
			'Error' : function(up, err, errTip) {
				//上传出错时,处理相关的事情
				console.log('Error')
			}
		}
	});
    // --------------------------------
    var $sexDropdown = $('#sexDropdown');
    var $sexDropdownMenu = $('#sexDropdown .menu');
    var $provinceDropdown = $('#provinceDropdown');
    var $provinceDropdownMenu = $('#provinceDropdown .menu');
    var $cityDropdown = $('#cityDropdown');
    var $cityDropdownMenu = $('#cityDropdown .menu');
    
    var $headimgurl = $('#headimgurl');
    var $nickname = $('#nickname');
    var $sex = $('#sex');
    var $province = $('#province');
    var $city = $('#city');
    var $phone = $('#phone');
    var $qq = $('#qq');
    var $url = $('#url');
    var $intro = $('#intro');
    var $saveBtn = $('#saveBtn');
    
    $sexDropdown.dropdown({
    	on: 'hover'
    });
    
    var cities = area[$province.val()];
    if (cities) {
        for (var i = 0; i < cities.length; i++) {
            $cityDropdownMenu.append($('<div class="item" data-value="' + cities[i] + '">' + cities[i] + '</div>;'));
        }
    }
    $cityDropdown.dropdown({
        on: 'hover'
    });
    $provinceDropdown.dropdown({
        on: 'hover',
        onChange: function(value, text) {
            $('#cityDropdown .menu .item').remove();
            var cities = area[value];
            if (cities) {
                for (var i = 0; i < cities.length; i++) {
                    $cityDropdownMenu.append($('<div class="item" data-value="' + cities[i] + '">' + cities[i] + '</div>;'));
                }
            }
            $city.val('');
            $cityDropdown.find('.text').html('请选择');
            $cityDropdown.dropdown({
                on: 'hover'
            });
        }
    });
    
    $saveBtn.on('click', function(e) {
        var headimgurl = $headimgurl.attr('src');
        var sHeadimgurl = $headimgurl.attr('data-sHeadimgurl');
        var nickname = $nickname.val();
        var sex = $sex.val();
        var province = $province.val();
        var city = $city.val();
        var phone = $phone.val();
        var qq = $qq.val();
        var url = $url.val();
        var intro = $intro.val();
        
        if (!nickname) {
        	iAlert("昵称不能为空");
        	return;
        }
        
        if (phone && !Util.isPhone(phone)) {
        	iAlert("请输入有效的手机号");
        	return;
        }

        $.ajax({
            url: '/api/users/info',
            type: 'PUT',
            data: {
                headimgurl: headimgurl,
                sHeadimgurl: sHeadimgurl,
                nickname: nickname,
                sex: Number(sex),
                province: province,
                city: city,
                phone: phone,
                qq: qq,
                url: url,
                intro: intro
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('修改成功');
                } else {
					iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });

    });
    

}); 