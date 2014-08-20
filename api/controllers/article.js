var xss = require('xss');
var marked = require('marked');
var Util = require('../common/util');
var Article = require('../proxy/article');
var ArticleLike = require('../proxy/articleLike');
var User = require('../proxy/user');
var Notebook = require('../proxy/notebook');
var auth = require('../policies/auth');
var ERRCODE = require('../../errcode');

module.exports = {

	/**
	 * Web页面
	 * -------------------------------------------
	 */
	// 微糖热门 - 七日热门文章
	showWeekly : function(req, res) {
		res.render('weekly');
	},

	// 微糖热门 - 三十日热门文章
	showMonthly : function(req, res) {
		res.render('monthly');
	},

	/**
	 * @method showArticleInfo
	 * 文章详情页
	 */
	showArticleInfo : function(req, res, next) {
		var _id = req.params._id;
		console.log(_id);
		_id = _id.slice(0, 24);
		console.log(_id);
		var isLogin = auth.isLogin(req, res);
		// 标记用户是否已经喜欢了该文章
		var hasLike = false;

		function cb() {
			Article.findArticleById(_id, function(err, article) {
				if (err) {
					return next(err);
				}
				article.htmlContent = marked(article.content);
				article.localCreateTime = Util.convertDate(article.createTime);
				res.render('articleInfo', {
					article : article,
					hasLike : hasLike
				});
			});
		}

		if (isLogin) {
			var userId = auth.getUserId(req, res);
			ArticleLike.findOne(userId, _id, function(err, articleLike) {
				if (err) {
					return next(err);
				}
				if (articleLike) {
					hasLike = true;
				}
				cb();
			});
		} else {
			cb();
		}
	},

	/**
	 * Ajax API接口
	 * -------------------------------------------
	 */
	/**
	 * @method newArticle
	 * 新建一篇文章，用户总文章数+1，文集下的总文章+1
	 */
	newArticle : function(req, res, next) {
		var body = req.body;
		var title = "无标题文章";
		var content = "";
		var belongToNotebookId = body.notebookId;
		var belongToUserId = auth.getUserId(req, res);

		Article.newArticle(title, content, belongToUserId, belongToNotebookId, function(err, article) {
			if (err) {
				return next(err);
			}
			return res.json({
				r : 0,
				msg : '新建文章成功',
				article : article
			});
		});
	},

	/**
	 * @method findAllArticleByNotebookId
	 * 查找某个文集下的所有文章
	 */
	findAllArticleByNotebookId : function(req, res, next) {
		var belongToNotebookId = req.params._id;

		Article.findAllByNotebookId(belongToNotebookId, function(err, articles) {
			if (err) {
				return next(err);
			}
			res.type('json');
			return res.json({
				r : 0,
				msg : "查找所有文章成功",
				articles : articles
			});
		});
	},

	/**
	 * @method updateArticleById
	 * 根据文章的Id修改某篇文章
	 */
	updateArticleById : function(req, res, next) {
		var articleId = req.params._id;
		var body = req.body;
		var title = xss(body.title);
		var content = xss(body.content);
		var intro = xss(body.intro);
		var wordsNum = Number(body.wordsNum);
		var diffNum = Number(body.diffNum);

		Article.updateArticleById(articleId, title, content, intro, wordsNum, function(err, article) {
			if (err) {
				return next(err);
			}
			User.updateWordsNum(article.belongToUserId, diffNum, function(err, user) {
				if (err) {
					return next(err);
				}
				return res.json({
					r : 0,
					msg : "更新文章成功",
					article : article
				});
			});
		});
	},

	/**
	 * @method updateArticleStatusById
	 * 发布 / 取消发布文章
	 */
	updateArticleStatusById : function(req, res, next) {
		var articleId = req.params._id;
		var status = Number(req.body.status) || 0;

		Article.updateStatus(articleId, status, function(err, article) {
			if (err) {
				return next(err);
			}
			res.type('json');
			return res.json({
				r : 0,
				msg : status === 0 ? "取消发布成功" : "发布成功",
				article : article
			});
		});
	},

	/**
	 * @method deleteArticleById
	 * 根据文章的Id删除某篇文章
	 */
	deleteArticleById : function(req, res, next) {
		var articleId = req.params._id;
		Article.deleteArticleById(articleId, function(err, article) {
			if (err) {
				return next(err);
			}
			User.findByIdAndUpdateArticlesNum(article.belongToUserId, -1, function(err, user) {
				if (err) {
					return next(err);
				}
				User.findByIdAndUpdateWordsNum(article.belongToUserId, -article.wordsNum, function(err, user) {
					if (err) {
						return next(err);
					}
					Notebook.findByIdAndUpdateArticlesNum(article.belongToNotebookId, -1, function(err, notebook) {
						if (err) {
							return next(err);
						}
						return res.json({
							r : 0,
							msg : "删除文章成功",
							article : article
						});
					});
				});
			});
		});
	},

	/**
	 * @method findArticlesByUserIdAndPage
	 * 分页查找某个用户的文章
	 */
	findArticlesByUserIdAndPage : function(req, res, next) {
		var userId = req.params._id;
		var query = req.query;
		var pageSize = Number(query.pageSize) || 20;
		var pageStart = Number(query.pageStart) || 0;
		var sortBy = query.sortBy || '-createTime';
		var status = Number(query.status);

		Article.findByUserIdAndPage(userId, pageSize, pageStart, sortBy, status, function(err, articles) {
			if (err) {
				return next(err);
			}
			return res.json({
				r : 0,
				msg : "分页查找某个用户的文章成功",
				articles : articles
			});
		});
	},

	/**
	 * @method findArticlesByTimeAndPage
	 * 分页查找最新发布的文章
	 */
	findArticlesByTimeAndPage : function(req, res, next) {
		var query = req.query;
		var pageSize = Number(query.pageSize) || 20;
		var pageStart = Number(query.pageStart) || 0;
		var sortBy = '-createTime';
		var status = 1;

		Article.findBypage(pageSize, pageStart, sortBy, status, function(err, articles) {
			if (err) {
				return next(err);
			}
			return res.json({
				r : 0,
				msg : "分页查询成功",
				articles : articles
			});
		});
	},

	/**
	 * @method likeArticle
	 * 喜欢文章
	 */
	likeArticle : function(req, res, next) {
		var articleId = req.params._id;
		var userId = auth.getUserId(req, res);

		ArticleLike.findOne(userId, articleId, function(err, articleLike) {
			if (err) {
				return next(err);
			}
			if (articleLike) {
				return res.json({
					r : 1,
					errcode : 10017,
					msg : ERRCODE[10017]
				});
			} else {
				ArticleLike.newArticleLike(userId, articleId, function(err, articleLike) {
					if (err) {
						return next(err);
					}
					return res.json({
						r : 0,
						msg : "喜欢成功",
						articleLike : articleLike
					});
				});
			}
		});
	},

	/**
	 * @method unLikeArticle
	 * 取消喜欢文章
	 */
	unLikeArticle : function(req, res, next) {
		var articleId = req.params._id;
		var userId = auth.getUserId(req, res);

		ArticleLike.findOne(userId, articleId, function(err, articleLike) {
			if (err) {
				return next(err);
			}
			if (articleLike) {
				ArticleLike.removeOneArticleLike(userId, articleId, function(err, articleLike) {
					if (err) {
						return next(err);
					}
					return res.json({
						r : 0,
						msg : "取消喜欢成功"
					});
				});
			} else {
				return res.json({
					r : 1,
					errcode : 10018,
					msg : ERRCODE[10018]
				});
			}
		});
	},

	/**
	 * @method findByArticleIdAndPage
	 * 分页查询某篇文章的喜欢记录
	 */
	findByArticleIdAndPage : function(req, res, next) {
		var articleId = req.params._id;
		var pageSize = req.query.pageSize;
		var pageStart = req.query.pageStart;

		ArticleLike.findByArticleIdAndPage(articleId, pageSize, pageStart, function(err, articleLikes) {
			if (err) {
				return next(err);
			}
			res.type('json');
			return res.json({
				r : 0,
				msg : "查找记录成功",
				articleLikes : articleLikes
			});
		});
	},

	// 我喜欢的
	findFavourites : function(req, res) {

	},

	// 分页查询七日热门文章
	findWeeklyByPage : function(req, res) {

	},

	// 分页查询三十日热门文章
	findMonthlyByPage : function(req, res) {

	}
}
