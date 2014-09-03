var xss = require('xss');

var Notebook = require('../proxy/notebook');
var NotebookSub = require('../proxy/notebookSub');
var Article = require('../proxy/article');
var User = require('../proxy/user');

var auth = require('../policies/auth');
var ERRCODE = require('../../errcode');

module.exports = {

	/**
	 * Web页面
	 * -------------------------------------------
	 */
	/**
	 * @method showNotebookInfo
	 * 文集主页 - 目录
	 */
	showNotebookInfo: function(req, res, next) {
		var notebookId = req.params._id;
		var path = req.route.path;

		if (notebookId.length !== 24) {
			return res.render('404');
		}
		Notebook.findNotebookById(notebookId, function(err, notebook) {
			if (err) {
				return next(err);
			}
			if (!notebook) {
				return res.render('404');
			} else {
				var isLogin = auth.isLogin(req, res);

				var cb = function() {
					var params = {
						notebook: notebook
					};
					if (/subscribers/.test(path)) {
						res.render('subscribersOfNotebook', params);
					} else {
						Article.findAllPublishedByNotebookId(notebookId, function(err, articles) {
							if (err) {
								return next(err);
							}
							params.articles = articles;
							res.render('notebookInfo', params);
						});
					}
				};
				if (isLogin) {
					var userId = auth.getUserId(req, res);
					// 已登录的用户需要判断是否已经订阅该文集
					NotebookSub.findOne(userId, notebookId, function(err, notebookSub) {
						if (err) {
							return next(err);
						}
						if (notebookSub) {
							notebook.hasSub = true;
						}
						cb();
					});
				} else {
					cb();
				}
			}
		});
	},

	/**
	 * Ajax API接口
	 * -------------------------------------------
	 */

	/**
	 * @method newNotebook
	 * 新建文集
	 */
	newNotebook: function(req, res, next) {
		var belongToUserId = auth.getUserId(req, res);
		var name = xss(req.body.name);
		Notebook.newNotebook(name, belongToUserId, function(err, notebook) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: '新建文集成功',
				notebook: notebook
			});
		});
	},

	// ==============

	/**
	 * @method findAllMyNotebooks
	 * 查找当前会话用户的所有文集
	 */
	findAllMyNotebooks: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		Notebook.findAllByUserId(userId, function(err, notebooks) {
			if (err) {
				return next(err);
			}
			res.type('json');
			return res.json({
				r: 0,
				msg: "查找所有文集成功",
				notebooks: notebooks
			});
		});
	},

	/**
	 * @method findAllNotebooksByUserId
	 * 根据用户Id查找某用户的所有文集
	 */
	findAllNotebooksByUserId: function(req, res, next) {
		var userId = req.params._id;
		Notebook.findAllByUserId(userId, function(err, notebooks) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查找所有文集成功",
				notebooks: notebooks
			});
		});
	},

	/**
	 * @method updateNotebookById
	 * 根据文集Id更新文集
	 */
	updateNotebookById: function(req, res, next) {
		var _id = req.params._id;
		var name = req.body.name;
		if (!name) {
			res.json({
				r: 1,
				errcode: 10012,
				msg: ERRCODE[10012]
			});
			return;
		} else {
			name = xss(name);
		}
		Notebook.updateName(_id, name, function(err, notebook) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: '更新文集成功',
				notebook: notebook
			});
		});
	},

	/**
	 * @method subNotebook
	 * 订阅文集
	 */
	subNotebook: function(req, res, next) {
		var notebookId = req.params._id;
		var userId = auth.getUserId(req, res);

		// 新建订阅记录之前需要检查是否已经订阅该文集
		NotebookSub.findOne(userId, notebookId, function(err, notebookSub) {
			if (err) {
				return next(err);
			}
			if (notebookSub) {
				return res.json({
					r: 1,
					msg: ERRCODE[10025],
					errcode: 10025
				});
			} else {
				NotebookSub.newNotebookSub(userId, notebookId, function(err, notebookSub) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "订阅成功"
					});
				});
			}
		});
	},

	/**
	 * @method unSubNotebook
	 * 取消订阅文集
	 */
	unSubNotebook: function(req, res, next) {
		var notebookId = req.params._id;
		var userId = auth.getUserId(req, res);

		// 取消订阅之前需要检测是否有该订阅记录
		NotebookSub.findOne(userId, notebookId, function(err, notebookSub) {
			if (err) {
				return next(err);
			}
			if (notebookSub) {
				NotebookSub.removeOneNotebookSub(userId, notebookId, function(err, notebookSub) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "取消订阅成功"
					});
				});
			} else {
				return res.json({
					r: 1,
					errcode: 10026,
					msg: ERRCODE[10026]
				});
			}
		});
	},

	/**
	 * @method findAllSubNotebooksByUserId
	 * 查询某用户订阅的所有文集
	 */
	findAllSubNotebooksByUserId: function(req, res, next) {
		var userId = req.params._id;
		NotebookSub.findAllByUserId(userId, function(err, notebooks) {
			if (err) {
				return next(err);
			}
			res.json({
				r: 0,
				msg: "查询所有的订阅文集成功",
				notebooks: notebooks
			});
		});
	},

	/**
	 * @method findUsersByNotebookIdAndPage
	 * 分页查询某个文集下的订阅用户
	 */
	findUsersByNotebookIdAndPage: function(req, res, next) {
		var notebookId = req.params._id;
		var pageSize = req.query.pageSize;
		var pageStart = req.query.pageStart;

		NotebookSub.findUsersByNotebookIdAndPage(notebookId, pageSize, pageStart, function(err, users) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查询订阅用户成功",
				users: users
			});
		});
	}

};