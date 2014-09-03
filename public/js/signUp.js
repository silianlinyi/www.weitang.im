require.config({
	paths : {
		"Util" : "../common/util"
	}
});

define(['Util'], function(Util) {
	var $email = $('#email');
	var $nickname = $('#nickname');
	var $password = $('#password');
	var $rePassword = $('#rePassword');
	var $captcha = $('#captcha');
	var $terms = $('#terms');
	var $message = $('#message');
	var $signUpBtn = $('#signUpBtn');

	function check(email, nickname, password, rePassword, captcha) {
		if (!email) {
			$message.html('邮箱不能为空').show();
			return false;
		}
		if (!Util.isEmail(email)) {
			$message.html('邮箱地址不合法').show();
			return false;
		}
		if (!nickname) {
			$message.html('昵称不能为空').show();
			return false;
		}
		if (!/^\w{6,20}$/.test(nickname)) {
			$message.html('昵称由6到20个英文、数字或下划线组成的字符').show();
			return false;
		}
		if (!password) {
			$message.html('密码不能为空').show();
			return false;
		}
		if (!rePassword) {
			$message.html('确认密码不能为空').show();
			return false;
		}
		if (password !== rePassword) {
			$message.html('两次输入的密码不一致').show();
			return false;
		}
		if (!captcha) {
			$message.html('验证码不能为空').show();
			return false;
		}
		return true;
	}


	$signUpBtn.on('click', function() {
		var checked = $terms[0].checked;
		if (!checked) {
			return;
		}

		var email = $email.val().trim();
		var nickname = $nickname.val().trim();
		var password = $password.val().trim();
		var rePassword = $rePassword.val().trim();
		var captcha = $captcha.val().trim();

		if (!check(email, nickname, password, rePassword, captcha)) {
			return;
		}

		$.ajax({
			url : '/api/signUp',
			type : 'POST',
			data : {
				email : email,
				nickname : nickname,
				password : hex_md5(password),
				captcha : captcha
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
                    window.location.href = '/registerSucc?email=' + email;
                } else {
                    $message.html(data.msg).show();
                    return;
                }
			}
		});

	});
	
    $('body').keydown(function(e) {
        if (e.keyCode === 13) {
            $signUpBtn.click();
        }
    });

	$('input').focus(function() {
		$message.hide();
	});

	$('.captcha img').on('click', function() {
		this.src = this.src;
	});
	$('.captcha a').on('click', function() {
		$('.captcha img').attr('src', '/api/captcha');
	});
	$terms.on('change', function() {
		if (!this.checked) {
			$signUpBtn.addClass('disabled');
		} else {
			$signUpBtn.removeClass('disabled');
		}
	});
	
});
