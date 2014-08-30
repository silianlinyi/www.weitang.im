"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 专题
 * name				专题名
 * description		专题描述
 * sourceUrl		原图链接
 * mThumbnailLink	中缩略图链接
 * sThumbnailLink	小缩略图链接
 * tags				专题标签
 * belongToUserId	创建该专题的用户Id
 * subscriptionsNum	专题被订阅次数
 * articlesNum		专题下文章数
 * createTime		专题创建时间
 * updateTime		专题最后更新时间
 */
var CollectionSchema = new Schema({
    name: {
    	type: String
    },
    description: {
    	type: String
    },
    sourceUrl: {
    	type: String
    },
    mThumbnailUrl: {
    	type: String
    },
    sThumbnailUrl: {
    	type: String
    },
    tags: {
    	type: Array,
    	default: []
    },
    belongToUserId: {
    	type: ObjectId,
    	ref: 'User'
    },
    subscriptionsNum: {
    	type: Number,
    	default: 0
    },
    articlesNum: {
    	type: Number,
    	default: 0
    },
    createTime: {
        type: Number,
        default: Date.now
    },
    updateTime: {
        type: Number,
        default: Date.now
    },
    // 是否订阅，动态添加的
    hasSub: {
    	type: Boolean,
    	default: false
    },
    // 文章是否收入专题
    hasAdd: {
    	type: Boolean,
    	default: false
    }
});

CollectionSchema.statics = {
	
	/**
	 * @method updateArticlesNum
	 * 修改专题下的文章数
	 */
	updateArticlesNum : function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc : {
				articlesNum : num
			}
		}, callback);
	}
	
};

module.exports = mongoose.model("Collection", CollectionSchema, "wt_collections");