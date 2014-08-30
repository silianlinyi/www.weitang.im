"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Collection = require('./Collection');

/**
 * 文章专题表
 * 一篇文章可以加入多个专题，一个专题可以添加多篇文章
 * collectionId 专题Id
 * articleId	文章Id
 * createTime	创建时间
 */
var ArticleCollSchema = new Schema({
	collectionId: {
		type: ObjectId,
		ref: 'Collection'
	},
	articleId: {
		type: ObjectId,
		ref: 'Article'
	},
	createTime: {
		type: Number,
		default: Date.now
	}
});



// 类方法
ArticleCollSchema.statics = {

	/**
	 * @method removeAllByArticleId
	 * 根据文章Id删除与该文章相关的所有收录记录
	 */
	removeAllByArticleId: function(articleId, callback) {
		this.remove({
			articleId: articleId
		}, function(err, articleColls) {
			if (err) {
				return callback(err, null);
			}
			var len = articleColls.length;
			var articleColl;
			var counter = 0;
			if (len === 0) {
				return callback(null, articleColls);
			}
			for (var i = 0; i < len; i++) {
				articleColl = articleColls[i];
				// 触发器1：相应专题的articlesNum属性-1
				Collection.updateArticlesNum(articleColl.collectionId, -1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					counter++;
					if (counter === len) {
						return callback(null, articleColls);
					}
				});
			}
		});
	}

};

module.exports = mongoose.model("ArticleColl", ArticleCollSchema, "wt_article_colls");