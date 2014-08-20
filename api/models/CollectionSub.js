"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CollectionSubSchema = new Schema({
	userId: {
		type: ObjectId,
		ref: 'User'
	},
	collectionId: {
		type: ObjectId,
		ref: 'Collection'
	},
    createTime: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model("CollectionSub", CollectionSubSchema, "wt_collection_subs");