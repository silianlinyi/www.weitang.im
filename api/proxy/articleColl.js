var ArticleColl = require('../models/ArticleColl');
var Article = require('./article');
var Collection = require('./collection');

module.exports = {

	/**
	 * @method newArticleColl
	 * 新建一条文章被收录到专题记录
	 */
	newArticleColl : function(articleId, collectionId, callback) {
		var articleColl = new ArticleColl({
			articleId : articleId,
			collectionId : collectionId
		});
		// 保存文章收录记录
		articleColl.save(function(err, articleColl) {
			if (err) {
				return callback(err, null);
			}
			// 相应文章的belongToCollectionIds属性添加一个元素
			Article.addBelongToCollectionIds(articleId, collectionId, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 相应专题的articlesNum属性 +1
				Collection.updateArticlesNum(collectionId, 1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleColl);
				});
			});
		});
	},

	/**
	 * @method removeOneArticleColl
	 * 删除一条本章收录专题记录
	 */
	removeOneArticleColl : function(articleId, collectionId, callback) {
		// 删除文章收录记录
		ArticleColl.findOneAndRemove({
			articleId : articleId,
			collectionId : collectionId
		}, function(err, articleColl) {
			if (err) {
				return callback(err, null);
			}
			// 相应文章的belongToCollectionIds属性删除一个元素
			Article.pullBelongToCollectionIds(articleId, collectionId, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				// 相应专题的articlesNum属性-1
				Collection.updateArticlesNum(collectionId, -1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, articleColl);
				});
			});
		});
	},

	/**
	 * @method findOne
	 * 根据文章Id和专题Id查找文章收录记录，如果不为空，说明文章已经收到到该专题
	 */
	findOne : function(articleId, collectionId, callback) {
		ArticleColl.findOne({
			articleId : articleId,
			collectionId : collectionId
		}, callback);
	},

	/**
	 * @method findAll
	 * 查询某篇文章被收录的所有专题
	 */
	findAllCollectionsByArticleId : function(articleId, callback) {
		ArticleColl.find({
			articleId : articleId
		}, callback);
	}
};
