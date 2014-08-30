require.config({
	paths: {
		"iAlert": "../common/iAlert"
	}
});

define('User', ['iAlert'], function(iAlert) {

	/**
	 * @method following
	 * 关注用户
	 */
	function following(followerId, callback) {
		$.ajax({
			url: '/api/users/' + followerId + '/following',
			type: 'POST',
			dataType: 'json',
			timeout: 15000,
			success: function(data) {
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

	/**
	 * 取消关注用户
	 * @method unFollowing
	 */
	function unFollowing(followerId, callback) {
		$.ajax({
			url: '/api/users/' + followerId + '/unFollowing',
			type: 'DELETE',
			dataType: 'json',
			timeout: 15000,
			success: function(data) {
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

	// 用户主页左侧公共的逻辑
	// ----------------------

	// 关注
	$('.userPanel').on('click', '.followingBtn', function() {
		var me = this;
		var followerId = $(me).attr('data-id');
		following(followerId, function(data) {
			if (data.r === 0) {
				$(me).removeClass('followingBtn').addClass('red unFollowingBtn');
				$(me).html('<i class="icon checkmark"></i>正在关注');
			}
		});
	});

	// 取消关注
	$('.userPanel').on('click', '.unFollowingBtn', function() {
		var me = this;
		var followerId = $(me).attr('data-id');
		unFollowing(followerId, function(data) {
			if (data.r === 0) {
				$(me).removeClass('red unFollowingBtn').addClass('followingBtn');
				$(me).html('<i class="icon add"></i>关注');
			}
		});
	});

	$('.userPanel').on('mouseover', '.unFollowingBtn', function() {
		$(this).html('<i class="icon remove"></i>取消关注');
	});

	$('.userPanel').on('mouseout', '.unFollowingBtn', function() {
		$(this).html('<i class="icon checkmark"></i>正在关注');
	});

	return {
		following: following,
		unFollowing: unFollowing
	};

});