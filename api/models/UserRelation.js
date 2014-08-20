"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserRelationSchema = new Schema({
	followingId : {
		type : ObjectId,
		ref : "User"
	},
	followerId : {
		type : ObjectId,
		ref : "User"
	},
	createTime: {
        type: Number,
        default: Date.now,
        index: true
    }
});

// 添加实例方法
UserRelationSchema.methods = {
	
};

// 添加静态方法
UserRelationSchema.statics = {

};

module.exports = mongoose.model("UserRelation", UserRelationSchema, "wt_user_relations"); 