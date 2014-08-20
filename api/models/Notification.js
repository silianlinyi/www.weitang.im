"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 提醒
 * XXX订阅了你的专题《XXX》
 * XXX评论了你的文章《XXX》
 * XXX喜欢了你的文章《XXX》
 * 你投稿专题XXX的文章《XXX》被编辑拒绝了
 * 你投稿专题XXX的文章《XXX》被编辑接受了
 * 你的文章《XXX》已被加入专题 《XXX》
 * 
 * type		提醒类型（0-未知、1-订阅、2-评论、3-喜欢、4-投稿、5-文章被加入专题）
 * type = 1:
 * 	{
 *		type: 1,
 * 		userId: '用户Id',
 * 		nickname: '用吗昵称',
 * 		collectionId: '专题Id',
 * 		collectionName: '专题名',
 * 		createTime: 1405308049481
 * 	}
 * type = 2:
 * 	{
 * 		type: 2,
 * 		userId: '用户Id',
 * 		nickname: '用户昵称',
 * 		articleId: '文章Id',
 * 		articleName: '文章标题',
 * 		createTime: 1405308049481
 * 	}
 * type = 3:
 * 	{
 * 		type: 3,
 * 		userId: '用户Id',
 * 		nickname: '用户昵称',
 * 		articleId: '文章Id',
 * 		articleName: '文章标题',
 * 		createTime: 1405308049481
 * 	}
 * type = 4:
 * {
 *		type: 4,
 * 		collectionId: '专题Id',
 * 		collectionName: '专题名',
 * 		articleId: '文章Id',
 * 		articleName: '文章标题',
 * 		createTime: 1405308049481
 * 	}
 * type = 5:
 * 	{
 * 		type: 5,
 * 		articleId: '文章Id',
 * 		articleName: '文章标题',
 * 		collectionId: '专题Id',
 * 		collectionName: '专题名',
 * 		createTime: 1405308049481
 * 	}
 */
var NotificationSchema = new Schema({
    type: {
    	type: Number,
    	default: 0
    },
    createTime: {
    	type: Number,
    	default: Date.now
    }
});

module.exports = mongoose.model("Notification", NotificationSchema, "wt_notifications");