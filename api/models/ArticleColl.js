"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

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

module.exports = mongoose.model("ArticleColl", ArticleCollSchema, "wt_article_colls");