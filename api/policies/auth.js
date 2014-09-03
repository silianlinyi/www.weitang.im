var ERRCODE = require('../../errcode');

module.exports = {

	newSession : function(req, res, user) {
		req.session.user = {
			_id : user._id,
			email : user.email,
			nickname : user.nickname,
			headimgurl : user.headimgurl,
			active : user.active
		};
	},
	
	// 获取当前会话的用户Id
	getUserId: function(req, res) {
		return req.session.user._id;
	},
	
	// 获取当前会话用户的Email
	getUserEmail: function(req, res) {
		return req.session.user.email;
	},
	
	isLogin: function(req, res) {
		return !!req.session.user;
	},
	
	// 页面请求认证
	pageAuth: function(req, res, next) {
		if(!req.session.user) {
			var returnUrl = req.originalUrl;
			res.redirect('/signIn?returnUrl=' + returnUrl);
		} else {
			next();	
		}
	},
	
	ajaxAuth: function(req, res, next) {
		if(!req.session.user) {
			res.json({
				r: 1,
				errcode: 10011,
				msg: ERRCODE[10011]
			});
		} else {
			next();
		}
	}
};
