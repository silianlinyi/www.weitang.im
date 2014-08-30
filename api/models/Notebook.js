"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 文集
 * _id				数据库默认生成的唯一Id
 * name				文集名字
 * belongToUserId 	文集作者Id
 * articlesNum		文集下的文章数
 * subsNum			文集被订阅次数
 * createTime		文集创建时间
 * updateTime		文集最后更新时间
 * hasSub			动态添加的属性，当前会话用户是否已经订阅该文集
 */
var NotebookSchema = new Schema({
	name: {
		type: String,
	},
	belongToUserId: {
		type: ObjectId,
		ref: "User"
	},
	articlesNum: {
		type: Number,
		default: 0
	},
	subsNum: {
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
	// 动态添加属性
	hasSub: {
		type: Boolean,
		default: false
	}
});

NotebookSchema.statics = {

	/**
	 * @method updateArticlesNum
	 * 修改文集总文章数
	 */
	updateArticlesNum: function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc: {
				articlesNum: num
			}
		}, callback);
	},

	/**
	 * @method updateSubsNum
	 * 修改文集总订阅数
	 */
	updateSubsNum: function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc: {
				subsNum: num
			}
		}, callback);
	}

};

module.exports = mongoose.model("Notebook", NotebookSchema, "wt_notebooks");