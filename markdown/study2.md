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

```
    
    