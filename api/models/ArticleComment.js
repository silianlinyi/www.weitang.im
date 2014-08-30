"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleCommentSchema = new Schema({
	content: {
		type: String
	},
	userId: {
		type: ObjectId,
		ref: 'User'
	},
	articleId: {
		type: ObjectId,
		ref: 'Article'
	},
	commentId: {
		type: ObjectId,
		ref: 'ArticleComment'
	},
	createTime: {
		type: Number,
		default: Date.now
	},
	updateTime: {
		type: Number,
		default: Date.now
	}
});

ArticleCommentSchema.statics = {

	/**
	 * @method removeAllByArticleId
	 * 根据文章Id删除与该文章相关的所有评论记录
	 */
	removeAllByArticleId: function(articleId, callback) {
		this.remove({
			articleId: articleId
		}, callback);
	}

};

module.exports = mongoose.model("ArticleComment", ArticleCommentSchema, "wt_article_comments");