var ArticleLike = require('../models/ArticleLike');
var Article = require('../models/Article');
var User = require('../models/User');

module.exports = {

	// -------------------------------------------------- 新建操作

	/**
	 * @method newArticleLike
	 * 喜欢文章
	 */
	newArticleLike: function(userId, articleId, callback) {
		var articleLike = new ArticleLike({
			userId: userId,
			articleId: articleId
		});
		articleLike.save(function(err, articleLike) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：关联文章的likesNum +1
			Article.updateLikesNum(articleId, 1, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：关联用户的likesNum +1
				User.updateLikesNum(userId, 1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleLike);
				});
			});
		});
	},

	// -------------------------------------------------- 删除操作

	/**
	 * @method removeOneArticleLike
	 * 取消喜欢文章
	 */
	removeOneArticleLike: function(userId, articleId, callback) {
		ArticleLike.findOneAndRemove({
			userId: userId,
			articleId: articleId
		}, function(err, articleLike) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：关联文章的likesNum -1
			Article.updateLikesNum(articleId, -1, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：关联用户的likesNum -1
				User.updateLikesNum(userId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleLike);
				});
			});
		});
	},

	/**
	 * @method removeAllByArticleId
	 * 根据文章Id删除与该文章相关的所有喜欢记录
	 */
	removeAllByArticleId: function(articleId, callback) {
		ArticleLike.remove({
			articleId: articleId
		}, function(err, articleLikes) {
			if (err) {
				return callback(err, null);
			}
			var len = articleLikes.length;
			var counter = 0;
			var articleLike;
			if (len === 0) {
				return callback(null, articleLikes);
			}
			for (var i = 0; i < len; i++) {
				articleLike = articleLikes[i];
				// 触发器1：关联用户的likesNum -1
				User.updateLikesNum(articleLike.userId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					counter++;
					if (counter === len) {
						return callback(null, articleLikes);
					}
				})
			}
		});
	},

	// -------------------------------------------------- 查询操作

	/**
	 * @method findOne
	 * 根据用户Id和文章Id查找喜欢记录，如果不为空，说明已喜欢该文章
	 */
	findOne: function(userId, articleId, callback) {
		ArticleLike.findOne({
			userId: userId,
			articleId: articleId
		}, callback);
	},

	/**
	 * @method findByArticleIdAndPage
	 * 分页查询某篇文章的喜欢记录
	 */
	findByArticleIdAndPage: function(articleId, pageSize, pageStart, callback) {
		var query = ArticleLike.find({
			articleId: articleId
		}).limit(pageSize).skip(pageStart).sort('-createTime');
		query.populate('userId', '_id nickname sHeadimgurl');
		query.exec(function(err, docs) {
			if (err) {
				return callback(err, null);
			}
			var len = docs.length;
			var ret = [];
			for (var i = 0; i < len; i++) {
				ret.push({
					_id: docs[i]._id,
					userId: docs[i].userId._id,
					nickname: docs[i].userId.nickname,
					sHeadimgurl: docs[i].userId.sHeadimgurl,
					articleId: docs[i].articleId,
					createTime: docs[i].createTime
				});
			}
			callback(null, ret);
		});
	}
};