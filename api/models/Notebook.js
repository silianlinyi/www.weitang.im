"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 文集
 * _id			数据库默认生成的唯一Id
 * belongToUserId 文集作者Id
 * name			文集名字
 * articlesNum	文集下的文章数
 * createTime	文集创建时间
 * updateTime	文集最后更新时间
 */
var NotebookSchema = new Schema({
    belongToUserId: {
    	type: ObjectId,
    	ref: "User"
    },
    name: {
    	type: String,
    },
    articlesNum: {
    	type: Number,
    	default: 0
    },
    wordsNum: {
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
    }
});

module.exports = mongoose.model("Notebook", NotebookSchema, "wt_notebooks");