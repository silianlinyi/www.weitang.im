"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 私信
 * toUser	收件人
 * fromUser	发件人
 * topic	话题
 * content	内容
 * status	0-未读、1-已读
 */
var MessageSchema = new Schema({
	toUser: {
		type: ObjectId,
		ref: 'User'
	},
	fromUser: {
		type: ObjectId,
		ref: 'User'
	},
	topic: {
		type: String,

	},
	content: {
		type: String
	},
	status: {
		type: Number,
		default: 0
	},
	createTime: {
		type: Number,
		default: Date.now
	}
});

module.exports = mongoose.model("Message", MessageSchema, "wt_messages");