var Notebook = require('../proxy/notebook');
var Article = require('../proxy/article');
var User = require('../proxy/user');

var auth = require('../policies/auth');
var xss = require('xss');
var ERRCODE = require('../../errcode');

module.exports = {

	/**
	 * @method newNotebook
	 * 新建文集
	 */
	newNotebook : function(req, res, next) {
		var name = xss(req.body.name);
		var belongToUserId = auth.getUserId(req, res);

		Notebook.newNotebook(name, belongToUserId, function(err, notebook) {
			if (err) {
				return next(err);
			}
			return res.json({
				r : 0,
				msg : '新建文集成功',
				notebook : notebook
			});
		});
	},

	/**
	 * @method deleteNotebookById
	 * 删除文集
	 * 文集被订阅：
	 * 删除文集下的所有文章，这些文章分：草稿和已发布
	 * 已发布的文章：用户总文章数减去已发布文章数，用户总字数减去已发布文章总字数
	 * 
	 */
	deleteNotebookById : function(req, res, next) {
		var _id = req.params._id;
		Notebook.deleteNotebookById(_id, function(err, notebook) {
			if (err) {
				return next(err);
			}
			Article.deleteAllByNotebookId(_id, function(err, articles) {
				if (err) {
					return next(err);
				}
				var len = articles.length;
				var wordsNum = 0; // 删除的已发布文章的总字数
				var articlesNum = 0; // 删除的已发布文章的总文章数
				
				for(var i = 0; i < len; i++) {
					if(articles[i].status === 1) { // 已发布的文章
						articlesNum++;
						wordsNum += articles[i].wordsNum;
					}
				}
				
				return res.json({
					r : 0,
					msg : "删除文集成功",
					notebook : notebook
				});
			});
		});
	},

	// ==============

	/**
	 * @method findAllMyNotebooks
	 * 查找当前会话用户的所有文集
	 */
	findAllMyNotebooks : function(req, res, next) {
		var userId = auth.getUserId(req, res);

		Notebook.findAllByUserId(userId, function(err, notebooks) {
			if (err) {
				return next(err);
			}
			res.type('json');
			res.json({
				r : 0,
				msg : "查找所有文集成功",
				notebooks : notebooks
			});
		});
	},

	/**
	 * @method findAllNotebooksByUserId
	 * 根据用户Id查找某用户的所有文集
	 */
	findAllNotebooksByUserId : function(req, res, next) {
		var userId = req.params._id;
		Notebook.findAllByUserId(userId, function(err, notebooks) {
			if (err) {
				return next(err);
			}
			res.type('json');
			res.json({
				r : 0,
				msg : "查找所有文集成功",
				notebooks : notebooks
			});
		});
	},

	/**
	 * @method updateNotebookById
	 * 根据文集Id更新文集
	 */
	updateNotebookById : function(req, res, next) {
		var _id = req.params._id;
		var name = req.body.name;
		if (!name) {
			res.json({
				r : 1,
				errcode : 10012,
				msg : ERRCODE[10012]
			});
			return;
		} else {
			name = xss(name);
		}
		Notebook.updateName(_id, name, function(err, notebook) {
			if (err) {
				return next(err);
			}
			res.type('json');
			res.json({
				r : 0,
				msg : '更新文集成功',
				notebook : notebook
			});
		});
	}
};

