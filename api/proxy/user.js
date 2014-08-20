var User = require('../models/User');
var Util = require('../common/util');

module.exports = {

	/**
	 * @method newUser
	 * 新增用户
	 * @param {String} email 邮箱
	 * @param {String} nickname 昵称
	 * @param {String} password 密码
	 * @param {Function} callback 回调函数
	 */
	newUser : function(email, nickname, password, callback) {
		var user = new User({
			email : email,
			nickname : nickname,
			password : Util.md5(password)
		});
		user.save(callback);
	},

	/**
	 * @method findUserById
	 * 根据用户Id查找用户信息
	 * @param {String} _id 用户Id
	 * @param {Function} callback 回调函数
	 */
	findUserById : function(_id, callback) {
		User.findById(_id, {
			password : 0
		}, callback);
	},

	/**
	 * @method findUserByEmail
	 * 根据邮箱地址查找用户信息
	 */
	findUserByEmail : function(email, callback) {
		User.findOne({
			email : email
		}, callback);
	},

	/**
	 * @method updatePassword
	 * 修改密码
	 */
	updatePassword : function(_id, password, callback) {
		User.findByIdAndUpdate(_id, {
			$set : {
				password : password
			}
		}, {
			password : 0
		}, callback);
	},

	/**
	 * @method updateFollowingNum
	 * 修改用户关注个数
	 */
	updateFollowingNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				followingNum : num
			}
		}, callback);
	},

	/**
	 * @method updateFollowersNum
	 * 修改用户粉丝个数
	 */
	updateFollowersNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				followersNum : num
			}
		}, callback);
	},

	/**
	 * @method updateArticlesNum
	 * 修改用户文章总数
	 */
	updateArticlesNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				articlesNum : num
			}
		}, callback);
	},

	/**
	 * @method updateWordsNum
	 * 修改用户总字数
	 */
	updateWordsNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				wordsNum : num
			}
		}, callback);
	},

	/**
	 * @method updateLikesNum
	 * 修改喜欢的文章数
	 */
	updateLikesNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				likesNum : num
			}
		}, callback);
	},

	/**
	 * @method updateCollLimitNum
	 * 修改可创建的专题数量
	 */
	updateCollLimitNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				collLimitNum : num
			}
		}, callback);
	},

	/**
	 * @method updateCollNum
	 * 修改已创建的专题数量
	 * @param {ObjectId} _id 用户Id
	 * @param {Number} num 正+ 负-
	 */
	updateCollNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				collNum : num
			}
		}, callback);
	},

	/**
	 * @method updateSubNum
	 * 修改订阅的专题数量
	 */
	updateSubNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				subNum : num
			}
		}, callback);
	},

	/**
	 * @method updateSubNoteNum
	 * 修改订阅的文集数量
	 */
	updateSubNoteNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				subNoteNum : num
			}
		}, callback);
	},

	/**
	 * @method updateNotebooksNum
	 * 修改已创建的文集数量
	 */
	updateNotebooksNum : function(_id, num, callback) {
		User.findByIdAndUpdate(_id, {
			$inc : {
				notebooksNum : num
			}
		}, callback);
	},

	/**
	 * @method findUsersByNickname
	 * 根据用户昵称查找用户
	 */
	findUsersByNickname : function(nickname, callback) {
		User.find({
			nickname : new RegExp(nickname, 'gi')
		}, {
			password : 0
		}, callback);
	},

	/**
	 * @method updateUserInfo
	 * 修改用户个人资料
	 */
	updateUserInfo : function(data, callback) {
		User.findByIdAndUpdate(data._id, {
			$set : {
				headimgurl : data.headimgurl,
				sHeadimgurl : data.sHeadimgurl,
				nickname : data.nickname,
				sex : data.sex,
				province : data.province,
				city : data.city,
				phone : data.phone,
				qq : data.qq,
				url : data.url,
				intro : data.intro
			}
		}, callback);
	}
};
