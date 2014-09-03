"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var config = require('../../config');

/**
 * 用户
 * email		邮箱
 * nickname		昵称
 * password		密码
 * phone		手机号
 * sex			性别（0-未知、1-男、2-女）
 * birthday		生日
 * qq			QQ
 * province		省份
 * city			城市
 * company		公司
 * job			岗位
 * school		学校
 * profession	专业
 * url			个人网站
 * intro		简介
 * WXQrcodeUrl	微信二维码图片地址
 * followingNum	关注个数
 * followersNum	粉丝个数
 * articlesNum	文章数
 * wordsNum		字数
 * likesNum		喜欢的文章数
 * collLimitNum	可创建的专题个数限制
 * collNum		已创建的专题个数
 * subNum		订阅的专题个数
 * notebooksNum	创建的文集个数
 * subNotebooksNum 订阅的文集个数
 * headimgurl	头像地址
 * sHeadimgurl	头像小缩略图地址
 * createTime	加入时间
 * updateTime	最后更新时间
 * resetTicket	重置密码Ticket
 * resetToken	重置密码token
 * openid		微信OpenID
 * activeTicket	激活帐号Ticket
 * activeToken	激活帐号token
 */
var UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		index: true
	},
	nickname: {
		type: String
	},
	password: {
		type: String
	},
	phone: {
		type: String,
		default: ''
	},
	sex: {
		type: Number,
		default: 0
	},
	birthday: {
		type: Number,
		default: 0
	},
	qq: {
		type: String,
		default: ''
	},
	province: {
		type: String,
		default: ''
	},
	city: {
		type: String,
		default: ''
	},
	company: {
		type: String,
		default: ''
	},
	job: {
		type: String,
		default: ''
	},
	school: {
		type: String,
		default: ''
	},
	profession: {
		type: String,
		default: ''
	},
	url: {
		type: String,
		default: ''
	},
	intro: {
		type: String,
		default: ''
	},
	WXQrcodeUrl: {
		type: String,
		default: ''
	},
	followingNum: {
		type: Number,
		default: 0
	},
	followersNum: {
		type: Number,
		default: 0
	},
	articlesNum: {
		type: Number,
		default: 0
	},
	wordsNum: {
		type: Number,
		default: 0
	},
	likesNum: {
		type: Number,
		default: 0
	},
	collLimitNum: {
		type: Number,
		default: config.COLLECTIONS_LIMIT_NUM
	},
	collNum: {
		type: Number,
		default: 0
	},
	subNum: {
		type: Number,
		default: 0
	},
	subNoteNum: {
		type: Number,
		default: 0
	},
	notebooksNum: {
		type: Number,
		default: 0
	},
	subNotebooksNum: {
		type: Number,
		default: 0
	},
	headimgurl: {
		type: String,
		default: ''
	},
	sHeadimgurl: {
		type: String,
		default: ''
	},
	createTime: {
		type: Number,
		default: Date.now
	},
	updateTime: {
		type: Number,
		default: Date.now
	},
	resetTicket: {
		type: Number,
		default: 0
	},
	resetToken: {
		type: String,
		default: ''
	},
	openId: {
		type: String,
		default: ''
	},
	activeTicket: {
		type: Number,
		default: 0
	},
	activeToken: {
		type: String,
		default: ''
	}

});


// 添加实例方法
UserSchema.methods = {

};

// 添加静态方法
UserSchema.statics = {
	
	/**
	 * @method updateArticlesNum
	 * 修改用户文章总数
	 */
	updateArticlesNum : function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc : {
				articlesNum : num
			}
		}, callback);
	},
	
	/**
	 * @method updateLikesNum
	 * 修改喜欢的文章数
	 */
	updateLikesNum: function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc: {
				likesNum: num
			}
		}, callback);
	},

	/**
	 * @method updateNotebooksNum
	 * 修改已创建的文集数量
	 */
	updateNotebooksNum: function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc: {
				notebooksNum: num
			}
		}, callback);
	},
	
	/**
	 * @method updateSubNoteNum
	 * 修改订阅的文集数量
	 */
	updateSubNoteNum : function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc : {
				subNoteNum : num
			}
		}, callback);
	},

	/**
	 * @method updateWordsNum
	 * 修改用户总字数
	 */
	updateWordsNum: function(_id, num, callback) {
		this.findByIdAndUpdate(_id, {
			$inc: {
				wordsNum: num
			}
		}, callback);
	}

};

module.exports = mongoose.model("User", UserSchema, "wt_users");