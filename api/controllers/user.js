var site = require('./site');
var User = require('../proxy/user');
var UserRelation = require('../proxy/userRelation');
var Notebook = require('../proxy/notebook');
var Article = require('../proxy/article');
var Collection = require('../proxy/collection');

var auth = require('../policies/auth');
var xss = require('xss');
var Util = require('../common/util');
var ccap = require('../services/ccap');
var ERRCODE = require('../../errcode');
var config = require('../../config');

// 验证邮箱
function checkEmail(req, res, email) {
	if (!email) {
		res.json({
			"r": 1,
			"errcode": 10001,
			"msg": ERRCODE[10001]
		});
		return false;
	}
	if (!Util.isEmail(email)) {
		res.json({
			"r": 1,
			"errcode": 10000,
			"msg": ERRCODE[10000]
		});
		return false;
	}
	return true;
}

// 验证昵称
function checkNickname(req, res, nickname) {
	if (!nickname) {
		res.json({
			"r": 1,
			"errcode": 10002,
			"msg": ERRCODE[10002]
		});
		return false;
	}
	if (!/^\w{6,20}$/.test(nickname)) {
		res.json({
			"r": 1,
			"errcode": 10003,
			"msg": ERRCODE[10003]
		});
		return false;
	}
	return true;
}

// 验证密码
function checkPassword(req, res, password) {
	if (!password) {
		res.json({
			"r": 1,
			"errcode": 10004,
			"msg": ERRCODE[10004]
		});
		return false;
	}
	return true;
}

/**
 * 验证验证码
 */
function checkCaptcha(req, res, captcha) {
	if (!captcha) {
		res.json({
			"r": 1,
			"errcode": 10005,
			"msg": ERRCODE[10005]
		});
		return false;
	}

	var _captcha = ccap.getCaptcha(req, res);
	if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
		res.json({
			"r": 1,
			"errcode": 10006,
			"msg": ERRCODE[10006]
		});
		return false;
	}
	return true;
}

module.exports = {

	/**
	 * Web页面
	 * -------------------------------------------
	 */

	/**
	 * 用户主页
	 */
	showUserInfo: function(req, res, next) {
		// url中的用户Id
		var userId = req.params._id;
		var isLogin = auth.isLogin(req, res);
		var isMyself = false;
		var hasFollow = false; // 是否已经关注用户
		var curUserId;
		if (isLogin) {
			// 当前会话用户的Id
			curUserId = auth.getUserId(req, res);
			isMyself = (userId === String(curUserId) ? true : false);
		}
		var path = req.route.path;
		User.findUserById(userId, function(err, user) {
			if (err) {
				return next(err);
			}
			Notebook.findAllByUserId(userId, function(err, notebooks) {
				if (err) {
					return next(err);
				}
				Collection.findAllByUserId(userId, function(err, collections) {
					if (err) {
						return next(err);
					}

					function cb() {
						var params = {
							u: user,
							totalSubNum: user.subNum + user.subNotebooksNum,
							isMyself: isMyself,
							hasFollow: hasFollow,
							notebooks: notebooks,
							collections: collections
						};

						if (/latestArticles/.test(path)) { // 如果请求的是用户 - 最新文章页
							res.render('latestArticles', params);
						} else if (/following/.test(path)) { // 如果请求的是用户 - 关注页
							res.render('following', params);
						} else if (/followers/.test(path)) { // 如果请求的是用户 - 粉丝页
							res.render('followers', params);
						} else if(/subscriptions/.test(path)) {
							res.render('subscriptions', params);
						} else if (/favourites/.test (path)) {
							res.render('favourites', params);
						} else {
							res.render('latestArticles', params); // 默认用户 - 最新文章页
						}
					}
					if (!isMyself) { // 不是我自己，还需判断是否关注该用户
						UserRelation.findOne(curUserId, userId, function(err, doc) {
							if (err) {
								return next(err);
							}
							if (doc) {
								hasFollow = true;
							}
							cb();
						});
					} else {
						cb();
					}
				});
			});
		});
	},

	// 我的主页 - 最新动态
	showTimeline: function(req, res) {

	},

	// 我的主页 - 热门文章
	showTopArticles: function(req, res) {

	},

	// 注册
	showSignUp: function(req, res) {
		res.render('signUp');
	},

	// 注册成功
	showRegisterSucc: function(req, res) {
		res.render('registerSucc');
	},

	// 登录
	showSignIn: function(req, res) {
		res.render('signIn');
	},

	showFavourites: function(req, res) {

	},

	// 设置 - 个人资料
	showSettingsIndex: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		User.findUserById(userId, function(err, user) {
			if (err) {
				return next(err);
			}
			res.render('settingsIndex', {
				u: user,
				QINIU_Domain: config.QINIU_Domain
			});
		});
	},

	/**
	 * Ajax API接口
	 * -------------------------------------------
	 */
	// 注册
	signUp: function(req, res, next) {
		var body = req.body;
		var email = xss(body.email);
		var nickname = xss(body.nickname);
		var password = xss(body.password);
		var captcha = body.captcha;

		if (!checkEmail(req, res, email)) {
			return;
		}
		if (!checkNickname(req, res, nickname)) {
			return;
		}
		if (!checkPassword(req, res, password)) {
			return;
		}
		if (!checkCaptcha(req, res, captcha)) {
			return;
		}

		User.findUserByEmail(email, function(err, user) {
			if (err) {
				return next(err);
			}
			if (!!user) {
				res.json({
					r: 1,
					errcode: 10008,
					msg: ERRCODE[10008]
				});
				return;
			}
			User.newUser(email, nickname, password, function(err, user) {
				if (err) {
					return next(err);
				}
				auth.newSession(req, res, user);
				// 注册成功后，默认生成一个文集和一篇文章
				Notebook.newNotebook("我的博客文集", user._id, function(err, notebook) {
					if (err) {
						return next(err);
					}

					Article.newArticle("Hello World", "", user._id, notebook._id, function(err, article) {
						if (err) {
							return next(err);
						}
						res.json({
							"r": 0,
							"msg": "注册成功"
						});
					});
				});
			});
		});
	},

	// 登录
	signIn: function(req, res, next) {
		var body = req.body;
		var email = body.email;
		var password = body.password;

		User.findUserByEmail(email, function(err, user) {
			if (err) {
				return next(err);
			}
			if (user === null) {
				res.json({
					r: 1,
					errcode: 10009,
					msg: ERRCODE[10009]
				});
				return;
			} else {
				if (user.password !== Util.md5(password)) {
					res.json({
						r: 1,
						errcode: 10010,
						msg: ERRCODE[10010]
					});
					return;
				} else {
					auth.newSession(req, res, user);
					res.json({
						r: 0,
						errcode: 1000,
						msg: ERRCODE[1000]
					});
					return;
				}
			}
		});
	},

	// 登出
	signOut: function(req, res) {
		req.session.destroy();
		res.redirect('/');
	},

	/**
	 * @method findUserById
	 * 根据用户Id查找某个用户
	 */
	findUserById: function(req, res) {
		var _id = req.params._id;
		User.findById(_id, function(err, user) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查找用户详情成功",
				user: user
			});
		})
	},

	/**
	 * @method updatePassword
	 * 修改密码
	 */
	updatePassword: function(req, res, next) {
		var email = auth.getUserEmail(req, res);
		var oldPass = req.body.oldPass;
		var newPass = req.body.newPass;

		User.findUserByEmail(email, function(err, user) {
			if (err) {
				return next(err);
			}
			if (user.password !== Util.md5(oldPass)) {
				return res.json({
					r: 1,
					errcode: 10010,
					msg: ERRCODE[10010]
				});
			} else {
				User.updatePassword(user._id, Util.md5(newPass), function(err, user) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: '修改密码成功'
					});
				});
			}
		});
	},

	/**
	 * @method updateUserInfo
	 * 修改个人资料
	 */
	updateUserInfo: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		var body = req.body;
		var headimgurl = body.headimgurl;
		var sHeadimgurl = body.sHeadimgurl;
		var nickname = body.nickname;
		var sex = Number(body.sex) || 0;
		var province = body.province;
		var city = body.city;
		var phone = body.phone;
		var qq = body.qq;
		var url = body.url;
		var intro = body.intro;

		if (!nickname) {
			return res.json({
				r: 1,
				errcode: 10002,
				msg: ERRCODE[10002]
			});
		}

		User.updateUserInfo({
			_id: userId,
			headimgurl: headimgurl,
			sHeadimgurl: sHeadimgurl,
			nickname: xss(nickname),
			sex: sex,
			province: province,
			city: city,
			phone: xss(phone),
			qq: xss(qq),
			url: xss(url),
			intro: xss(intro)
		}, function(err, user) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: '修改个人资料成功'
			});
		});
	},

	/**
	 * @method newUserRelation
	 * 关注用户
	 */
	followingUser: function(req, res, next) {
		var followingId = auth.getUserId(req, res); // 发起关注方用户Id
		var followerId = req.params._id; // 被关注者用户Id

		UserRelation.findOne(followingId, followerId, function(err, doc) {
			if (err) {
				return next(err);
			}
			if (doc) { // 说明用户已关注
				return res.json({
					r: 1,
					errcode: 10023,
					msg: ERRCODE[10023]
				});
			} else {
				UserRelation.newOne(followingId, followerId, function(err, doc) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "关注成功"
					});
				});
			}
		});
	},

	/**
	 * @method unFollowingUser
	 * 取消关注用户
	 */
	unFollowingUser: function(req, res, next) {
		var followingId = auth.getUserId(req, res); // 发起关注方用户Id
		var followerId = req.params._id; // 被关注者用户Id

		UserRelation.findOne(followingId, followerId, function(err, doc) {
			if (err) {
				return next(err);
			}
			if (!doc) { // 取消关注失败，您未关注该用户
				return res.json({
					r: 1,
					errcode: 10024,
					msg: ERRCODE[10024]
				});
			} else {
				UserRelation.removeOne(followingId, followerId, function(err, doc) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "取消关注成功"
					});
				});
			}
		});
	},

	/**
	 * @method findFollowingsByPage
	 * 分页查询用户的关注
	 */
	findFollowingsByPage: function(req, res, next) {
		var followingId = req.params._id;
		var pageSize = req.query.pageSize || 20;
		var pageStart = req.query.pageStart || 0;

		UserRelation.findFollowingsByPage(followingId, pageSize, pageStart, function(err, docs) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查询关注成功",
				users: docs
			});
		});
	},

	/**
	 * @method findFollowersByPage
	 * 分页查询用户的粉丝
	 */
	findFollowersByPage: function(req, res, next) {
		var followerId = req.params._id;
		var pageSize = req.query.pageSize || 20;
		var pageStart = req.query.pageStart || 0;

		UserRelation.findFollowersByPage(followerId, pageSize, pageStart, function(err, docs) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查询粉丝成功",
				users: docs
			});
		});
	},

	// 根据用户昵称搜索用户
	findUsersByNickname: function(req, res, next) {

	},

	// 分页查询所有用户
	findUsersByPage: function(req, res) {

	},

	// 根据关键字（用户昵称、邮箱地址、手机号）搜索用户
	findUsersByKey: function(req, res) {

	},

	// 根据用户Id删除某个用户
	deleteUserById: function(req, res) {

	},




	// 根据用户Id更新用户信息
	updateUserById: function(req, res) {

	}
};