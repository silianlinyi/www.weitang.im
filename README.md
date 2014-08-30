## 上线部署

* 1. 数据库执行db.wt_article_views.ensureIndex({"ctime":1},{"expireAfterSecs":60*60*24})

## 一、用户模块User
【用户表：User】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|email|String||邮箱|
|nickname|String||昵称|
|password|String||密码|
|phone|String||手机号|
|sex|Number|0|性别：0-未知、1-男、2-女|
|birthday|Number|0|生日|
|qq|Number||QQ号|
|province|String||省份|
|city|String||城市|
|identity|Number||职业：0-未知、1-学生、2-已工作|
|company|String||公司|
|job|String||岗位：前端开发工程师、iOS开发工程师等等。|
|school|String||学校|
|profession|String||专业|
|intro|String||简介|
|WXQrcodeUrl|String||微信二维码地址|
|followingNum|Number|0|关注个数|
|followersNum|Number|0|粉丝个数|
|articlesNum|Number|0|文章总数（已发布的）
|wordsNum|Number|0|总字数（已发布的）
|likesNum|Number|0|喜欢的文章总数
|collLimitNum|Number|5|可创建的专题数量|
|collNum|Number|0|已创建的专题数量
|subNum|Number|0|订阅的专题数量
|subNoteNum|Number |0|订阅的文集数量
|notebooksNum|Number|0|创建的文集数量|
|headimgurl|String||用户头像地址|
|createTime|Number||加入时间|
|updateTime|Number||最后更新日期|
|resetTicket|String||重置密码Ticket|
|resetToken|String||重置密码token
|openid|String||用户微信OpenId|
|activeTicket|String||激活帐号Ticket
|activeToken|String||激活帐号token

【用户关系表：UserRelation】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|followingId|ObjectId||发起关注用户Id|
|followerId|ObjectId||被关注用户Id|
|createTime|Number||文集创建时间|

【相关操作】

新增用户：User.newUser(email, nickname, password, callback)

根据用户Id查找用户信息：User.findUserById(_id, callback)
根据邮箱地址查找用户信息：User.findUserByEmail(email, callback)
根据用户昵称查找用户：User.findUsersByNickname(key, callback)

修改用户关注个数：User.updateFollowingNum(_id, num, callback) 
修改用户粉丝个数：User.updateFollowersNum(_id, num, callback)
修改用户文章总数：User.updateArticlesNum(_id, num, callback)
修改用户总字数：User.updateWordsNum(_id, num, callback)
修改喜欢的文章数：User.updateLikesNum(_id, num, callback)
修改可创建的专题数量：User.updateCollLimitNum(_id, num, callback)
修改已创建的专题数量：User.updateCollNum(_id, num, callback)
修改订阅的专题数量：User.updateSubNum(_id, num, callback)
修改订阅的文集数量：User.updateSubNoteNum(_id, num, callback)
修改已创建的文集数量：User.updateNotebooksNum(_id, num, callback)

关注：新建一条关注记录，发起关注用户对应的关注个数+1，被关注用户对应的粉丝个数+1。
UserRelation.newOne(followingId, followerId, callback)
User.updateFollowingNum(followingId, 1, callback)
User.updateFollowersNum(followerId, 1, callback)

取消关注：删除一条关注记录，发起取消关注用户对应的关注个数-1，被关注用户对应的粉丝个数-1.
UserRelation.removeOne(followingId, followerId, callback)
User.updateFollowingNum(doc.followingId, -1, callback)
User.updateFollowersNum(doc.followerId, -1, callback)


分页查询我关注的：UserRelation.findFollowingsByPage(followingId, pageSize, pageStart, callback)
分页查询我的粉丝：UserRelation.findFollowersByPage(followerId, pageSize, pageStart, callback)

## 二、文集模块
【文集表：Notebook】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToUserId|ObjectId||文集作者Id|
|name|String||文集名字|
|articlesNum|Number|0|文集总文章数（已发布文章的总数）|
|wordsNum|Number|0|文集总字数（已发布文章的总字数）|
|subsNum|Number|0|文集总订阅数|
|createTime|Number|创建时系统时间|文集创建时间|
|updateTime|Number|创建时系统时间|文集更新时间|

【文集订阅表：NotebookSub】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToUserId|ObjectId||订阅者Id|
|belongToNotebookId|ObjectId||文集Id|
|createTime|Number|创建时系统时间|创建时间|

【相关操作】

新建文集：newNotebook(name, belongToUserId, callback)
删除文集：deleteNotebookById(_id, callback)

根据文集Id查询文集：findNotebookById(_id, callback)
根据文集名字查询文集：findNotebooksByName(name, callback)

修改文集名字：updateName(_id, name, callback)
修改文集总文章数：updateArticlesNum(_id, num, callback)
修改文集总字数：updateWordsNum(_id, num, callback)
修改文集总订阅数：updateSubsNum(_id, num, callback)

订阅文集：新建一条订阅记录，订阅者订阅的文集数量+1，对应文集总订阅数+1
NotebookSub.newNotebookSub(belongToUserId, belongToNotebookId, callback)
User.updateSubNoteNum(belongToUserId, 1, callback)
Notebook.updateSubsNum(belongToNotebookId, 1, callback)

取消订阅文集：删除一条订阅记录，订阅者订阅的文集数-1，对应文集总订阅数-1
NotebookSub.removeOneNotebookSub(belongToUserId, belongToNotebookId, callback)
User.updateSubNoteNum(belongToUserId, -1, callback)
Notebook.updateSubsNum(belongToNotebookId, -1, callback)

查询某用户创建的所有文集：findAllByUserId(userId, callback)
查找某用户创建的所有文集（文章数>=1）：findAllByUserIdAnd(userId, callback)

## 三、专题模块

【专题表：Collection】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|name|String||专题名|
|description|String||专题描述|
|sourceUrl|String||专题封面原图Url地址|
|mThumbnailUrl|String||专题封面中缩略图Url地址|
|sThumbnailUrl|String||专题封面小缩略图Url地址|
|tags|Array||专题标签|
|belongToUserId|ObjectId||关联用户Id
|subscriptionsNum|Number||专题被订阅次数|
|articlesNum|Numbe||专题下的文章数|
|createTime|Number||创建时间|
|updateTime|Number||最后更新时间|
|hasSub|Boolean|false|是否订阅，动态判断|

【专题订阅表：CollectionSub】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|userId|ObjectId||关联用户Id
|collectionId|ObjectId||关联专题Id|
|createTime|Number||创建时间|

【相关操作】

新建专题：新建一个专题，相应用户创建的专题数+1
Collection.newCollection(name, description, sourceUrl, mThumbnailUrl, sThumbnailUrl, tags, belongToUserId, callback)
User.updateCollNum(belongToUserId, 1, callback)
删除专题：Collection.deleteCollectionById(_id, callback)

根据Id查询某个专题：Collection.findCollectionById(_id, callback)
根据专题名字查询专题：Collection.findCollectionsByName(name, callback)

更新专题信息：Collection.updateCollectionById(_id, name, description, sourceUrl, mThumbnailUrl, sThumbnailUrl, tags)
修改专题订阅次数：Collection.updateSubscriptionsNum(_id, num, callback)
修改专题下的文章数：Collection.updateArticlesNum(_id, num, callback)

订阅专题：新建一条专题订阅记录，订阅用户对应的专题订阅数+1，被订阅专题对应的总订阅数+1
CollectionSub.newCollectionSub(userId, collectionId, callback)
User.updateSubNum(userId, 1, callback)
Collection.updateSubscriptionsNum(collectionId, 1, callback)

取消订阅专题：删除一条订阅记录，订阅用户对应的专题订阅数-1，被订阅专题对应的总订阅数-1
CollectionSub.removeOneCollectionSub(userId, collectionId, callback)
User.updateSubNum(userId, -1, callback)
Collection.updateSubscriptionsNum(collectionId, -1, callback)

查询某用户创建的所有专题：findAllByUserId(userId, callback)



## 四、文章模块

【文章表：Article】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|title|String||标题|
|content|String||内容（markdown）|
|intro|String||简介|
|status|Number|0|状态：0-草稿，1-发布|
|belongToUserId|ObjectId||文章作者Id|
|belongToNotebookId|ObjectId||文章所属文集Id|
|belongToCollectionIds|ObjectId数组||文章入选的专题Id数组列表|
|wordsNum|Number|0|文章字数|
|viewsNum|Number|0|文章被查看次数|
|likesNum|Number|0|文章被喜欢次数|
|commentsNum|Number|0|文章被评论次数|
|createTime|Number|Date.now()|创建日期|
|updateTime|Number|Date.now()|更新日期|

【文章喜欢表：ArticleLike】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToUserId|ObjectId||关联用户Id|
|belongToArticleId|ObjectId||关联文章Id|
|createTime|Number|Date.now()|创建日期|

【文章专题表：ArticleCollection】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToCollectionId|ObjectId||关联专题Id|
|belongToArticleId|ObjectId||关联文章Id|
|createTime|Number|Date.now()|创建日期|

【文章评论表：ArticleComment】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToArticleId|ObjectId||关联文章Id|
|belongToUserId|ObjectId||关联用户Id|
|content|String||评论内容|
|createTime|Number|Date.now()|创建日期|

【文章书签表：ArticleBookmark】

|字段|类型|默认值|描述
| ------------- |:-------------:|
|_id|ObjectId||默认生成的唯一Id|
|belongToUserId|ObjectId||关联用户Id|
|belongToArticleId|ObjectId||关联文章Id|
|createTime|Number|Date.now()|创建日期|

【相关操作】

新建文章：Article.newArticle(title, content, belongToUserId, belongToNotebookId, callback)
删除文章：Article.deleteArticleById(_id, callback)
删除某个文集下的所有文章：Article.deleteAllByNotebookId(belongToNotebookId, callback)

根据文章Id查询某个文章：Article.findArticleById(_id, callback)
根据文章名查询：Article.findArticlesByTitle(title, callback)
查询某个文集下的所有文章：Article.findAllByNotebookId(belongToNotebookId, callback)
查询某个文集下的所有文章（已发布）：Article.findAllPublishedByNotebookId(belongToNotebookId, callback)

更新文章：Article.updateArticleById(articleId, title, content, intro, wordsNum, callback)
发布、取消发布文章：Article.updateStatus(_id, status, callback)








**注意：**
文集与文章的关系：一个文集可以有多篇文章，一篇文章只能属于一个文集。
专题与文章的关系：一个专题可以有多篇文章，一篇文章可以加入多个专题。
















