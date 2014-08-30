var ArticleColl = require('../models/ArticleColl');
var Article = require('../models/Article');
var Collection = require('../models/Collection');

module.exports = {

	// -------------------------------------------------- 新建操作

	/**
	 * @method newArticleColl
	 * 新建一条文章收录记录
	 */
	newArticleColl: function(articleId, collectionId, callback) {
		var articleColl = new ArticleColl({
			articleId: articleId,
			collectionId: collectionId
		});
		// 保存文章收录记录
		articleColl.save(function(err, articleColl) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：相应文章的belongToCollectionIds属性添加一个元素
			Article.addBelongToCollectionIds(articleId, collectionId, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：相应专题的articlesNum属性 +1
				Collection.updateArticlesNum(collectionId, 1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleColl);
				});
			});
		});
	},

	// -------------------------------------------------- 删除操作

	/**
	 * @method removeOneArticleColl
	 * 删除一条文章收录专题记录
	 */
	removeOneArticleColl: function(articleId, collectionId, callback) {
		ArticleColl.findOneAndRemove({
			articleId: articleId,
			collectionId: collectionId
		}, function(err, articleColl) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：相应文章的belongToCollectionIds属性删除一个元素
			Article.pullBelongToCollectionIds(articleId, collectionId, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：相应专题的articlesNum属性-1
				Collection.updateArticlesNum(collectionId, -1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleColl);
				});
			});
		});
	},

	// -------------------------------------------------- 查询操作

	/**
	 * @method findOne
	 * 根据文章Id和专题Id查找文章收录记录，如果不为空，说明文章已经收到到该专题
	 */
	findOne: function(articleId, collectionId, callback) {
		ArticleColl.findOne({
			articleId: articleId,
			collectionId: collectionId
		}, callback);
	},

	/**
	 * @method findAll
	 * 查询某篇文章被收录的所有专题
	 */
	findAllCollectionsByArticleId: function(articleId, callback) {
		ArticleColl.find({
			articleId: articleId
		}, callback);
	},

	/**
	 * @method findByCollectionIdAndPage
	 * 分页查询某个专题下的文章
	 */
	findByCollectionIdAndPage: function(collectionId, pageSize, pageStart, sortBy, callback) {
		var query = ArticleColl.find({
			collectionId: collectionId
		}).limit(pageSize).skip(pageStart).sort(sortBy);
		query.populate('articleId');
		query.exec(function(err, docs) {
			if (err) {
				return callback(err, null);
			}
			var len = docs.length;
			var ret = [];
			var counter = 0;
			if (len === 0) {
				return callback(null, ret);
			}
			for (var i = 0; i < len; i++) {
				docs[i].articleId.populate('belongToNotebookId belongToCollectionIds', '_id name', function(err, article) {
					if (err) {
						return callback(err, null);
					}
					counter++;
					ret.push({
						_id: article._id,
						title: article.title,
						intro: article.intro,
						belongToNotebookId: article.belongToNotebookId,
						belongToCollectionIds: article.belongToCollectionIds,
						commentsNum: article.commentsNum,
						likesNum: article.likesNum,
						createTime: article.createTime
					});
					if (counter === len) {
						return callback(null, ret);
					}
				});
			}
		});
	}


};