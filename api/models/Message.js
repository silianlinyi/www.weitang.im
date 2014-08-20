"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 私信
 * inUserId		收信方用户ID
 * sendUserId	发件方用户ID
 * createTime	创建时间
 * content		私信内容
 */
var MessageSchema = new Schema({
    
});

module.exports = mongoose.model("Message", MessageSchema, "wt_messages");