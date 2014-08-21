var Message = require('../proxy/message');
var auth = require('../policies/auth');
var User = require('../proxy/user');
var ERRCODE = require('../../errcode');

module.exports = {

	/**
	 * Web页面
	 * -------------------------------------------
	 */
	// 私信 - 收件箱
	showInbox: function(req, res) {
		res.render('inbox');
	},

	// 私信 - 发件箱
	showSent: function(req, res) {
		res.render('sent');
	},

	// 私信 - 写信
	showNew: function(req, res) {
		var toUser = req.query.toUser;
		var topic = req.query.topic;
		res.render('newMessage', {
			toUser: toUser,
			topic: topic
		});
	},

	// 私信 - 详情
	showMessageInfo: function(req, res, next) {
		var _id = req.params._id;
		var userId = auth.getUserId(req, res);

		if (_id.length !== 24) {
			res.render('404');
		}

		Message.findById(_id, function(err, message) {
			if (err) {
				return next(err);
			}
			if (message) {
				var inbox = true;
				if (String(userId) === String(message.toUser._id)) {
					inbox = true; // 当前用户是收件人
					Message.updateStatus(_id, 1, function(err, doc) {
						if (err) {
							return next(err);
						}
						res.render('messageInfo', {
							message: message,
							inbox: inbox
						});
					});
				} else if (String(userId) === String(message.fromUser._id)) {
					inbox = false; // 当前用户是
					res.render('messageInfo', {
						message: message,
						inbox: inbox
					});
				}
			} else {
				return res.render('404');
			}
		});
	},

	/**
	 * Ajax API接口
	 * -------------------------------------------
	 */

	/**
	 * @method newMessage
	 * 新建一封私信
	 */
	newMessage: function(req, res, next) {
		var fromUser = auth.getUserId(req, res);
		var body = req.body;
		var topic = body.topic;
		var content = body.content;
		var toUserEmail = body.toUser;
		User.findUserByEmail(toUserEmail, function(err, user) {
			if (err) {
				return next(err);
			}
			if (user) {
				Message.newMessage(user._id, fromUser, topic, content, function(err, message) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "发送私信成功",
						message: message
					});
				});
			} else {
				return res.json({
					r: 11,
					msg: ERRCODE[10021],
					errcode: 10021
				});
			}
		});
	},

	/**
	 * @method findMessageById
	 * 根据私信Id查询
	 */
	findMessageById: function(req, res, next) {
		var _id = req.params._id;
		Message.findById(_id, function(err, message) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: '查询私信成功',
				message: message
			});
		});
	},

	/**
	 * @method findMessagesByPage
	 * 分页查询私信（包括收信和发信）
	 */
	findMessagesByPage: function(req, res, next) {
		var query = req.query;
		var pageSize = query.pageSize;
		var pageStart = query.pageStart;
		var toUser = query.toUser;
		var fromUser = query.fromUser;

		Message.findByPage(toUser, fromUser, pageSize, pageStart, function(err, messages) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查询私信成功",
				messages: messages
			});
		});
	},

	/**
	 * @method updateMessageStatus
	 * 私信 - 从未读修改为已读状态
	 */
	updateMessageStatus: function(req, res, next) {
		var _id = req.params._id;
		var status = req.body.status || 1;

		Message.updateStatus(_id, status, function(err, message) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "修改私信状态成功",
				message: message
			});
		});
	},

	/**
	 * @method deleteMessageById
	 * 根据私信Id删除私信
	 */
	deleteMessageById: function(req, res, next) {
		var _id = req.params._id;
		Message.findByIdAndRemove(_id, function(err, message) {
			if (err) {
				return next(err);
			}
			res.json({
				r: 0,
				msg: "删除成功"
			});
		});
	}


};