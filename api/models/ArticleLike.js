"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleLikeSchema = new Schema({
	userId: {
		type: ObjectId,
		ref: 'User'
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

ArticleLikeSchema.statics = {
	
	/**
	 * @method removeAllByArticleId
	 */
	removeAllByArticleId: function(articleId, callback) {
		
	}
	
};

module.exports = mongoose.model("ArticleLike", ArticleLikeSchema, "wt_article_likes");