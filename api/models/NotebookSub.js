"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var NotebookSubSchema = new Schema({
	belongToUserId : {
		type : ObjectId,
		ref : "User"
	},
	belongToNotebookId : {
		type : ObjectId,
		ref : "Notebook"
	},
	createTime: {
        type: Number,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model("NotebookSub", NotebookSubSchema, "wt_notebook_subs"); 