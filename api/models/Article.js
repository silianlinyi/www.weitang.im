"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 文章
 * title				标题
 * content				内容（Markdown字符串）
 * intro				简介
 * status				文章状态 0-草稿 1-已发布
 * belongToUserId		文章作者Id
 * belongToNotebookId	文章所属文集Id
 * belongToCollectionIds文章入选的专题Id数组列表
 * wordsNum				文章字数
 * viewsNum				文章被查看次数
 * likesNum				文章被喜欢次数
 * commentsNum			文章评论个数
 * createTime			文章创建时间
 * updateTime			文章最后更新时间
 */
var ArticleSchema = new Schema({
	title: {
		type: String
	},
	content: {
		type: String,
		default: ''
	},
	intro: {
		type: String,
		default: ''
	},
	status: {
		type: Number,
		default: 0
	},
	belongToUserId: {
		type: ObjectId,
		ref: 'User'
	},
	belongToNotebookId: {
		type: ObjectId,
		ref: 'Notebook'
	},
	belongToCollectionIds: [{
		type: ObjectId,
		ref: 'Collection'
	}],
	wordsNum: {
		type: Number,
		default: 0
	},
	viewsNum: {
		type: Number,
		default: 0
	},
	likesNum: {
		type: Number,
		default: 0
	},
	commentsNum: {
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
	}
});

// 添加实例方法
ArticleSchema.methods = {

};

// 添加静态方法
ArticleSchema.statics = {
	
	/**
	 * @method updateStatus
	 * 发布 / 取消发布文章
	 */
	updateStatus: function(_id, status, callback) {
		this.findByIdAndUpdate(_id, {
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
		this.findByIdAndUpdate(_id, {
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
		this.findByIdAndUpdate(_id, {
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
		this.findByIdAndUpdate(_id, {
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
		this.findByIdAndUpdate(_id, {
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
		this.findByIdAndUpdate(_id, {
			$pull: {
				belongToCollectionIds: collectionId
			}
		}, callback);
	}

};



module.exports = mongoose.model("Article", ArticleSchema, "wt_articles");