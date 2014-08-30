"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * followingId	关注者Id
 * followerId	被关注者Id
 */
var UserRelationSchema = new Schema({
	followingId: {
		type: ObjectId,
		ref: "User"
	},
	followerId: {
		type: ObjectId,
		ref: "User"
	},
	createTime: {
		type: Number,
		default: Date.now,
		index: true
	}
});

module.exports = mongoose.model("UserRelation", UserRelationSchema, "wt_user_relations");