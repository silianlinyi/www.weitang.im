"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleViewSchema = new Schema({
	articleId: {
		type: ObjectId,
		index: true
	},
	ip: {
		type: String,
		index: true
	},
	ctime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("ArticleView", ArticleViewSchema, "wt_article_views");