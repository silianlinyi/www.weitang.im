var Article = require('../models/Article');
var ArticleColl = require('../models/ArticleColl');
var ArticleComment = require('../models/ArticleComment');
var ArticleLike = require('../models/ArticleLike');
var Notebook = require('../models/Notebook');
var User = require('../models/User');

var ArticleLikeProxy = require('./articleLike');

module.exports = {

	// -------------------------------------------------- 新建操作

	/**
	 * 新建文章
	 */
	newArticle: function(title, content, belongToUserId, belongToNotebookId, callback) {
		var article = new Article({
			title: title,
			content: content,
			belongToUserId: belongToUserId,
			belongToNotebookId: belongToNotebookId
		});
		article.save(callback);
	},

	// -------------------------------------------------- 删除操作

	/**
	 * @method deleteArticleById
	 * 根据文章Id删除某篇文章
	 */
	deleteArticleById: function(articleId, callback) {
		Article.findByIdAndRemove(articleId, function(err, article) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：删除该文章相关的所有收录记录
			ArticleColl.removeAllByArticleId(articleId, function(err, articleColls) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：删除与该文章相关的所有评论记录
				ArticleComment.removeAllByArticleId(articleId, function(err, comments) {
					if (err) {
						return callback(err, null);
					}
					// 触发器3：删除与该文章相关的所有喜欢记录
					ArticleLikeProxy.removeAllByArticleId(articleId, function(err, likes) {
						if (err) {
							return callback(err, null);
						}
						// 触发器4：
						if (article.status === 0) { // 草稿
							return callback(null, article);
						} else { // 已发布
							// 文章所在文集的文集数-1
							Notebook.updateArticlesNum(article.belongToNotebookId, -1, function(err, notebook) {
								if (err) {
									return callback(err, null);
								}
								// 文章作者字数减去所删文章的字数
								User.updateWordsNum(article.belongToUserId, -article.wordsNum, function(err, user) {
									if (err) {
										return callback(err, null);
									}
									return callback(null, article);
								});
							});
						}
					});
				});
			});
		});
	},

	/**
	 * @method deleteAllByNotebookId
	 * 删除某个文集下的所有文章
	 */
	deleteAllByNotebookId: function(notebookId, callback) {
		Article.remove({
			belongToNotebookId: notebookId
		}, callback);
	},

	// -------------------------------------------------- 查询操作

	/**
	 * @method findArticleById
	 * 根据文章Id查询某个文章
	 */
	findArticleById: function(_id, callback) {
		var query = Article.findById(_id);
		query.populate('belongToUserId', '_id nickname intro sHeadimgurl');
		query.populate('belongToNotebookId', '_id name');
		query.populate('belongToCollectionIds', '_id name sThumbnailUrl');
		query.exec(callback);
	},

	/**
	 * 根据文章名查询
	 */
	findArticlesByTitle: function(title, callback) {
		Article.find({
			title: new RegExp(title, 'gi')
		}, callback);
	},

	/**
	 * 查询某个文集下的所有文章
	 */
	findAllByNotebookId: function(belongToNotebookId, callback) {
		Article.find({
			belongToNotebookId: belongToNotebookId
		}).sort('-createTime').exec(callback);
	},

	/**
	 * @method findAllPublishedByNotebookId
	 * 查询某个文集下的所有文章（已发布）
	 */
	findAllPublishedByNotebookId: function(belongToNotebookId, callback) {
		Article.find({
			belongToNotebookId: belongToNotebookId,
			status: 1
		}).sort('-createTime').exec(callback);
	},

	// -------------------------------------------------- 更新操作

	/**
	 * @method updateArticleById
	 * 更新文章
	 */
	updateArticleById: function(articleId, title, content, intro, wordsNum, callback) {
		Article.findByIdAndUpdate(articleId, {
			$set: {
				title: title,
				content: content,
				intro: intro,
				wordsNum: wordsNum,
				updateTime: Date.now()
			}
		}, callback);
	},

	updateStatus: function(_id, status, callback) {
		Article.updateStatus(_id, status, callback);
	},



	/**
	 * @method findByUserIdAndPage
	 * 分页查找某用户的文章
	 */
	findByUserIdAndPage: function(userId, pageSize, pageStart, sortBy, status, callback) {
		var query;
		if (status) {
			query = Article.find({
				belongToUserId: userId,
				status: status
			});
		} else {
			query = Article.find({
				belongToUserId: userId
			});
		}
		query.limit(pageSize).skip(pageStart).sort(sortBy);
		query.populate('belongToUserId', 'nickname headimgurl intro WXQrcodeUrl');
		query.populate('belongToNotebookId', 'name');
		query.populate('belongToCollectionIds', 'name sThumbnailUrl');
		query.exec(callback);
	},

	/**
	 * @method findBypage
	 * 分页查询
	 */
	findBypage: function(pageSize, pageStart, sortBy, status, callback) {
		var query = Article.find({
			status: status
		}, {
			content: 0
		}).limit(pageSize).skip(pageStart).sort(sortBy);
		query.populate('belongToUserId', '_id nickname sHeadimgurl');
		query.populate('belongToNotebookId', '_id name');
		query.populate('belongToCollectionIds');
		query.exec(callback);
	}
};