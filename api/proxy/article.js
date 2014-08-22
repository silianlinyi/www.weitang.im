var Article = require('../models/Article');

module.exports = {

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

	/**
	 * @method deleteArticleById
	 * 根据文章Id删除某篇文章
	 */
	deleteArticleById: function(articleId, callback) {
		Article.findByIdAndRemove(articleId, callback);
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
	 * 查询某个文集下的所有文章（已发布）
	 */
	findAllPublishedByNotebookId: function(belongToNotebookId, callback) {
		Article.find({
			belongToNotebookId: belongToNotebookId,
			status: 1
		}).sort('-createTime').exec(callback);
	},

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

	/**
	 * 发布 / 取消发布文章
	 */
	updateStatus: function(_id, status, callback) {
		Article.findByIdAndUpdate(_id, {
			$set: {
				status: status
			}
		}, callback);
	},

	/**
	 * @method updateViewsNum
	 * 更新文章被查看次数
	 */
	updateViewsNum: function(_id, num, callback) {
		Article.findByIdAndUpdate(_id, {
			$inc: {
				viewsNum: num
			}
		}, callback);
	},

	/**
	 * @method updateLikesNum
	 * 更新文章喜欢次数
	 */
	updateLikesNum: function(_id, num, callback) {
		Article.findByIdAndUpdate(_id, {
			$inc: {
				likesNum: num
			}
		}, callback);
	},

	/**
	 * @method updateCommentsNum
	 * 更新文章评论个数
	 */
	updateCommentsNum: function(_id, num, callback) {
		Article.findByIdAndUpdate(_id, {
			$inc: {
				commentsNum: num
			}
		}, callback);
	},

	/**
	 * @method addBelongToCollectionIds
	 * 收录文章时，往belongToCollectionIds数组添加一个collectionId
	 */
	addBelongToCollectionIds: function(_id, collectionId, callback) {
		Article.findByIdAndUpdate(_id, {
			$addToSet: {
				belongToCollectionIds: collectionId
			}
		}, callback);
	},

	/**
	 * @method pullBelongToCollectionIds
	 * 取消收录文章时，删除belongToCollectionIds数组中对应的一个collectionId
	 */
	pullBelongToCollectionIds: function(_id, collectionId, callback) {
		Article.findByIdAndUpdate(_id, {
			$pull: {
				belongToCollectionIds: collectionId
			}
		}, callback);
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