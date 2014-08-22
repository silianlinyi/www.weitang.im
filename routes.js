var express = require('express');
var router = express.Router();

var site = require('./api/controllers/site');
var article = require('./api/controllers/article');
var bookmark = require('./api/controllers/bookmark');
var collection = require('./api/controllers/collection');
var message = require('./api/controllers/message');
var notebook = require('./api/controllers/notebook');
var notification = require('./api/controllers/notification');
var timeline = require('./api/controllers/timeline');
var user = require('./api/controllers/user');
var admin = require('./api/controllers/admin');

var ccap = require('./api/services/ccap');
var qiniu = require('./api/services/qiniu');

var auth = require('./api/policies/auth');

/**
 * Web页面
 * -------------------------------------------
 */
// 防止微信端页面刷新时，页面空白
router.get('/*', function(req, res, next) {
	res.set({
		'Content-Type': 'text/html',
		'ETag': Date.now()
	});
	next();
});

// 首页
router.get('/', site.showIndex);
// 注册
router.get('/signUp', user.showSignUp);
// 注册成功
router.get('/registerSucc', user.showRegisterSucc);
// 登录
router.get('/signIn', user.showSignIn);
// 专题 - 我的订阅
router.get('/collections/sub', auth.pageAuth, collection.showSub);
// 专题 - 我的专题
router.get('/collections/mine', auth.pageAuth, collection.showMine);
// 专题 - 新建专题
router.get('/collections/new', auth.pageAuth, collection.showNew);
// 专题 - 全部专题
router.get('/collections', collection.showCollections);
// 专题详情 - 最新文章
router.get('/collections/:_id', collection.showCollectionByTime);
// 微糖热门 - 七日热门文章
router.get('/top/weekly', article.showWeekly);
// 微糖热门 - 三十日热门文章
router.get('/top/monthly', article.showMonthly);
// 最新动态 - 最新动态
router.get('/timeline', timeline.showTimeline);
// 最新动态 - 最新文章
router.get('/timeline/latest', timeline.showLatest);
// 我的书签
router.get('/bookmarks', bookmark.showBookmarks);
// 写文章
router.get('/write', auth.pageAuth, site.showWrite);
// 我的主页 - 关注
router.get('/users/:_id/following', user.showFollowing);
// 我的主页 - 粉丝
router.get('/users/:_id/followers', user.showFollowers);
// 我的主页 - 最新文章
router.get('/users/:_id', user.showLatestArticles);
router.get('/users/:_id/latestArticles', user.showLatestArticles);
// 我的主页 - 最新动态
router.get('/users/:_id/timeline', user.showTimeline);
// 我的主页 - 热门文章
router.get('/users/:_id/topArticles', user.showTopArticles);
// 我喜欢的
router.get('/favourites', user.showFavourites);
// 提醒
router.get('/notifications', notification.showNotifications);
// 私信 - 收件箱
router.get('/messages', auth.pageAuth, message.showInbox);
router.get('/messages/inbox', auth.pageAuth, message.showInbox);
// 私信 - 发件箱
router.get('/messages/sent', auth.pageAuth, message.showSent);
// 私信 - 写信
router.get('/messages/new', auth.pageAuth, message.showNew);
// 私信 - 详情页
router.get('/messages/:_id', auth.pageAuth, message.showMessageInfo);
// 文章详情页
router.get('/articles/:_id', article.showArticleInfo);
// 设置-首页（个人资料）
router.get('/settings', auth.pageAuth, user.showSettingsIndex);
// 设置-修改密码
router.get('/settings/password', auth.pageAuth, site.showSettingsPassword);


/**
 * admin页面
 * -------------------------------------------
 */
// admin首页
router.get('/admin/login', admin.showLogin);

/**
 * Ajax API接口
 * -------------------------------------------
 */
// 七牛云存储相关接口
router.get('/api/qiniu/uptoken', qiniu.getUptoken);
// 获取验证码
router.get('/api/captcha', ccap.newCaptcha);
// 登出
router.get('/signOut', user.signOut);
router.get('/api/signOut', user.signOut);
// 注册
router.post('/api/signUp', user.signUp);
// 登录
router.post('/api/signIn', user.signIn);

// === 用户操作 ===
// 根据用户Id获取用户详情
router.get('/api/users/:_id', user.findUserById);
// 修改密码
router.put('/api/users/password', auth.ajaxAuth, user.updatePassword);
// 修改个人资料
router.put('/api/users/info', auth.ajaxAuth, user.updateUserInfo);
// 根据用户昵称搜索用户
router.get('/api/users/nickname', user.findUsersByNickname);

// === 文集操作 ===
// 新建文集
router.post('/api/notebooks', auth.ajaxAuth, notebook.newNotebook);

// 查找当前会话用户的所有文集
router.get('/api/notebooks/mine', auth.ajaxAuth, notebook.findAllMyNotebooks);
// 查找某用户的所有文集
router.get('/api/users/:_id/notebooks', notebook.findAllNotebooksByUserId);
// 更新某个文集
router.put('/api/notebooks/:_id', auth.ajaxAuth, notebook.updateNotebookById);
// 删除某个文集
router.delete('/api/notebooks/:_id', auth.ajaxAuth, notebook.deleteNotebookById);

// === 文章操作 ===
// 新建一篇文章
router.post('/api/articles', auth.ajaxAuth, article.newArticle);
// 修改文章
router.put('/api/articles/:_id', auth.ajaxAuth, article.updateArticleById);
// 发布 / 取消发布文章
router.put('/api/articles/:_id/status', auth.ajaxAuth, article.updateArticleStatusById);
// 查询某个文集下的所有文章
router.get('/api/notebook/:_id/articles', article.findAllArticleByNotebookId);
// 删除某篇文章
router.delete('/api/articles/:_id', auth.ajaxAuth, article.deleteArticleById);
// 分页查询某用户的文章
router.get('/api/users/:_id/articles', article.findArticlesByUserIdAndPage);
// 分页查询最新发表的文章
router.get('/api/articles/newest', article.findArticlesByTimeAndPage);
// 喜欢文章
router.post('/api/articles/:_id/like', auth.ajaxAuth, article.likeArticle);
// 取消喜欢文章
router.delete('/api/articles/:_id/unLike', auth.ajaxAuth, article.unLikeArticle);
// 分页查询某篇文章的喜欢记录
router.get('/api/articles/:_id/likes', article.findByArticleIdAndPage);
// 收录文章
router.post('/api/articles/:_id/add', auth.ajaxAuth, collection.addArticle);
// 取消收录文章
router.delete('/api/articles/:_id/unAdd', auth.ajaxAuth, collection.removeArticle);
// 新建一条文章评论
router.post('/api/articles/:_id/comment', auth.ajaxAuth, article.newArticleComment);
// 分页查询某篇文章的评论
router.get('/api/articles/:_id/comments', article.findCommentsByArticleIdAndPage);
// 根据评论id删除某一条评论
router.delete('/api/comments/:_id', auth.ajaxAuth, article.deleteCommentById);

// === 专题操作 ===
// 新建专题
router.post('/api/collections', auth.ajaxAuth, collection.newCollection);
// 我创建的所有专题
router.get('/api/collections/mine', auth.ajaxAuth, collection.findAllMyCollections);
// 订阅专题
router.post('/api/collections/:_id/sub', auth.ajaxAuth, collection.subCollection);
// 取消订阅专题
router.delete('/api/collections/:_id/unSub', auth.ajaxAuth, collection.unSubCollection);
// 我订阅的所有专题
router.get('/api/collections/sub', auth.ajaxAuth, collection.findAllMyCollectionSubs);
// 根据关键字搜索专题
router.get('/api/collections/search', collection.findCollectionsByKey);
// 查找某用户创建的所有专题
router.get('/api/users/:_id/collections', collection.findAllCollectionsByUserId);
// 我创建的所有专题，并且返回当前文章是否已经收录信息
router.get('/api/collections/mine/with', auth.ajaxAuth, collection.findAllMyCollectionsWith);

// === 私信操作 ===
// 新建一封私信
router.post('/api/messages', auth.ajaxAuth, message.newMessage);
// 根据私信Id查询
router.get('/api/messages/:_id', auth.ajaxAuth, message.findMessageById);
// 分页查询私信（包括收信和发信）
router.get('/api/messages', auth.ajaxAuth, message.findMessagesByPage);
// 私信 - 从未读修改为已读状态
router.put('/api/messages/:_id/status', auth.ajaxAuth, message.updateMessageStatus);
// 删除一条私信
router.delete('/api/messages/:_id', auth.ajaxAuth, message.deleteMessageById);


/**
 * 后台管理页面
 * -------------------------------------------
 */
router.get('/admin/login', admin.showLogin);

module.exports = router;