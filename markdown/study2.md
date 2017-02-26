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
嵌套子查询的两种方式的区别
![](http://i1.piimg.com/567571/85bd5bdb3a26be3b.png)
[subdocuments](https://docs.mongodb.com/v2.2/core/read-operations/#subdocuments)

    
    