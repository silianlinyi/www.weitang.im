require.config({
	paths : {
		"iAlert" : "../common/iAlert"
	}
});

define(['iAlert'], function(iAlert) {

	// 修改密码
	// ----------------------------------------
	var $oldPassword = $('#oldPassword');
	var $password = $('#password');
	var $rePassword = $('#rePassword');
	var $oldPasswordTip = $('#oldPasswordTip');
	var $passwordTip = $('#passwordTip');
	var $rePasswordTip = $('#rePasswordTip');
	var $saveBtn = $('#saveBtn');

	$saveBtn.on('click', function() {
		var oldPassword = $oldPassword.val().trim();
		var password = $password.val().trim();
		var rePassword = $rePassword.val().trim();

		if (!oldPassword) {
			$oldPasswordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (!password) {
			$passwordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (!rePassword) {
			$rePasswordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (password !== rePassword) {
			$rePasswordTip.html('两次输入的密码不一致').css('visibility', 'visible');
			return;
		}

		$.ajax({
			url : '/api/users/password',
			type : 'PUT',
			data : {
				oldPass : hex_md5(oldPassword),
				newPass : hex_md5(password)
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
					iAlert('修改成功');
				} else {
					$oldPasswordTip.html('旧密码不正确').css('visibility', 'visible');
				}
			}
		});
	});

	$('input').focus(function() {
		$('.pointing.label').css('visibility', 'hidden');
	});

});

