require.config({
	paths : {
		"URL" : "../common/url"
	}
});

define(['URL'], function(URL) {

	var $email = $('#email');
	var $password = $('#password');
	var $message = $('#message');
	var $loginBtn = $('#loginBtn');

	var parseObj = URL.parse(window.location.href);
	var returnUrl = parseObj.queryObj.returnUrl || '/';

	$loginBtn.on('click', function() {
		var email = $email.val().trim();
		var password = $password.val().trim();
		
		if(!email) {
			$message.html('<i class="Attention icon"></i>邮箱不能为空').show();
			$email.focus();
			return;
		}
		if(!password) {
			$message.html('<i class="Attention icon"></i>密码不能为空').show();
			$password.focus();
			return;
		}
		
		$.ajax({
			url : '/api/signIn',
			type : 'POST',
			data : {
				email : email,
				password : hex_md5(password)
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data) {
				console.log(data);
				if (data.r === 0) {
                    window.location.href = returnUrl;
                } else {
                    $message.html('<i class="Attention icon"></i>' + data.msg).show();
                    return;
                }
			}
		});
		
	});
	
	$('body').keydown(function(e) {
        if (e.keyCode === 13) {
            $loginBtn.click();
        }
    });
	
	$('input').focus(function() {
		$message.hide();
	});

});
