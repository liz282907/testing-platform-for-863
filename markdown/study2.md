### 开发杂项

1. 设置发送邮件（nodemailer）的transporter的options时,要注意pass不是邮箱的登录密码，而是smtp等service的授权码
否则在verify的时候会遇到下面的错误
![](http://p1.bpimg.com/567571/4cfe280cd10674fe.png)
应该找到授权码
![](http://p1.bqimg.com/567571/3d57d97e8d768bd0.png)

2. 找回密码与重置密码

    - 找回密码是 username/email(数据库中存在该人) + token(发送请求的是本人)。

        楼主试了下qq的找回密码是 邮箱/或者其他能唯一验证的信息 + 验证码（csrf的防范中我们也提到过这个方法）+ 密保手机（双重防范）

        经过上面的步骤后就可以验证是本人的请求，就可以真正 reset pass + 新密码了。
    
        对于邮箱来说，就是处理reset_pass这个action + 新密码
    
    - 重置密码则是输入自己的原有信息（username+pass身份验证）+ 新密码。
    
    本质上差不多
    
3. 数据库操作

- find

```javascript
db.unicorns.find({gender: 'm',weight: {$gt: 700}})
//$lt, $lte, $gt, $gte 和 $ne

//区分update set
db.unicorns.update({name: 'Roooooodles'},{weight: 590}) //update 先根据 name 找到一个文档，然后用新文档(第二个参数)覆盖替换了整个文档。

//update operator
db.unicorns.update({name: 'Pilot'},{$inc: {vampires: -2}})

//upserts 即在文档中找到匹配值时更新它，无匹配时向文档插入新值，
db.hits.update({page: 'unicorns'},{$inc: {hits: 1}}, {upsert:true});

//字段选择 ，find的第二个参数，0表示不返回
db.unicorns.find({}, {name: 1});

//排序
//by unicorn name then vampire kills:
db.unicorns.find().sort({name: 1,vampires: -1}) //先按name升序排序，然后按vampires降序排列

//分页 limit ,skip
db.unicorns.find()
    .sort({weight: -1})
    .limit(2)
    .skip(1)
    
//count
db.unicorns.find({vampires: {$gt: 50}}).count()
= db.unicorns.count({vampires: {$gt: 50}})

```

4. 连接知识

- 内连接（两张表中都有的数据才会显示）
    - 相等链接
    - 自然连接（相同的列只显示一遍）
    - 交叉连接（笛卡尔积）
- 外链接
    - 左外链接 （理解为“有左显示”），左右共有+左有右没有
    - 右外链接  （理解为“有右显示”）
    - 全连接      （都显示）inner +(left-inner)+(right-inner) 
- 自连接

Mongodb由于是文档型数据库，没有关系的概念，也就是在建立数据的关联时会比较麻烦。但是提供了populate方法来实现这一功能，具体来说：

在mongoose中，可以对两个表的某些特定字段（通常type为ObjectId）声明ref,(用作连接)，然后使用[populte操作](http://www.nodeclass.com/api/mongoose.html#guide_populate)即可实现连接操作，
会in place 替换id为查询到的document arrays。 而且可以实现多连接，看起来像是左连接...[栗子](http://stackoverflow.com/questions/14363065/mongoose-mongodb-query-joins-but-i-come-from-a-sql-background)


```javascript
        user.token = token
        user.save();    

db.user.update({},{$rename:{"gender":"sex"}},false,true)
/*
  db.collection.update(criteria, objNew, upsert, multi )
  criteria:update的查询条件，类似sql update查询内where后面的
  objNew:update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的。
  upsert : 如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
  multi : mongodb默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。

*/
```

5. 分页查找


嵌套子查询的两种方式的区别
![](http://i1.piimg.com/567571/85bd5bdb3a26be3b.png)
[subdocuments](https://docs.mongodb.com/v2.2/core/read-operations/#subdocuments)


### reference
- [Mongoose populate使用方法](http://lovemew67.github.io/2013/02/22/newstream/)
    