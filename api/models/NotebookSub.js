"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 文集订阅记录
 * 文集 - 用户属于多对多的关系
 */
var NotebookSubSchema = new Schema({
	belongToUserId: {
		type: ObjectId,
		ref: "User"
	},
	belongToNotebookId: {
		type: ObjectId,
		ref: "Notebook"
	},
	createTime: {
		type: Number,
		default: Date.now,
		index: true
	}
});

module.exports = mongoose.model("NotebookSub", NotebookSubSchema, "wt_notebook_subs");