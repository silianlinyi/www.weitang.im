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

module.exports = mongoose.model("ArticleComment", ArticleCommentSchema, "wt_article_comments");