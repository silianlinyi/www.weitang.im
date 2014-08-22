var ArticleComment = require('../models/ArticleComment');
var Article = require('./article');

module.exports = {

	/**
	 * @method newComment
	 * 新建一条文章评论
	 * @param {String} content 回复内容
	 * @param {String} userId 关联用户Id
	 * @param {String} articleId 关联文章Id
	 * @param {String} commentId 回复Id，当二级回复时设定该值
	 * @param {Function} callback 回调函数
	 */
	newComment: function(content, userId, articleId, commentId, callback) {
		if (typeof commentId === 'function') {
			callback = commentId;
			commentId = null;
		}
		var comment = new ArticleComment({
			content: content,
			userId: userId,
			articleId: articleId
		});
		if (commentId) {
			comment.commentId = commentId;
		}
		comment.save(function(err, comment) {
			if (err) {
				return callback(err, null);
			}
			Article.updateCommentsNum(articleId, 1, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				ArticleComment.findById(comment._id).populate('userId', '_id nickname sHeadimgurl').exec(callback);
			});
		});
	},
	
	/**
	 * @method removeOne
	 * 删除一条文章评论
	 */
	findByIdAndRemove: function(_id, callback) {
		ArticleComment.findByIdAndRemove(_id, function(err, comment) {
			if (err) {
				return callback(err, null);
			}
			Article.updateCommentsNum(comment.articleId, -1, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				return callback(null, comment);
			});
		});
	},

	/**
	 * @method findById
	 * 根据评论Id查找
	 */
	findById: function(_id, callback) {
		var query = ArticleComment.findById(_id);
		query.populate('userId', '_id nickname sHeadimgurl');
		query.exec(callback);
	},

	/**
	 * @method findByArticleIdAndPage
	 * 根据文章Id分页查询评论列表
	 */
	findByArticleIdAndPage: function(articleId, pageSize, pageStart, callback) {
		var query = ArticleComment.find({
			articleId: articleId
		}).limit(pageSize).skip(pageStart).sort('-createTime');
		query.populate('userId', '_id nickname sHeadimgurl');
		query.exec(callback);
	}

};