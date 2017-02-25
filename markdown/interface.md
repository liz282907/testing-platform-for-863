
## 863项目用户注册登录部分数据接口

> @luchen
chenlu.seu@gmail.com

### 注册

#### 原则

- 用户名、密码、确认密码、邮箱非空
- 用户名长度>=6
- 密码长度6-20，闭区间，密码===确认密码
- 邮箱验证


#### request

```javascript
//request: 
// url: yoursite/auth/signup           
// method: [get|post] 始终单页应用，get请求就在本页，post见下
//post body:
{
	"username":"luch",
	"email": "1234@qq.com",
	"password": "1234578",
	"confirmPass": "1234578"
}

```
#### response

- error的情况：

    格式不正确，违背上述原则的，以及用户名/邮箱已被注册的
返回的response 的statuscode 为422

    ```javascript
    {
        error: 'somemsg'
    }
    
    ```
- success: status 201
 
     ```javascript
    {
         msg: "创建成功"
    }
    
    ```
 
 
 ---
 
 ### 登录
 
 get同上，下述为post
 
 
 #### request
 
 ```javascript
 //url : yoursite/auth/signin
 
 {
 	"username":"luchen",       //虽说username，但实际上是name或者邮箱
 	"password": "1234578"
 }
 
 
 ```
 #### response
 
 - error1：
 
     格式不正确，如为空，返回的response 的statuscode 为422
 
     ```javascript
     {
         error: 'somemsg'
     }
     
     ```
 - error2：
  
      身份认证失败，返回的response 的statuscode 为401，response同上
  
      
 - success: status 200
  
      ```javascript
     {
          msg: "创建成功"
     }
     
     ```
  success后会返回session相关的signedCookie到浏览器，有maxAge设置，对前台不可见。
  
  ### 找回密码
  
  邮箱找回密码
   输入邮箱，点击找回密码后，会往邮箱中发送重置密码的链接，
   
   ```
   //request
   url: yoursite/auth/retrieve_pass  
   method: post
   postbody: 
   {
   	"email": "422364804@qq.com"
   }
   
   //response
   {
        error: '邮箱不存在' // status 401
   }
   or success:      status: 200
   {
        msg: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'
   }
   ```
   
   ### 重置密码
   
   #### get: 
   
   点击重置链接，跳转到reset页面，对前台开发人员不可见，只需知道点击链接后成功或失败对reset页面的get请求的响应有影响
   
   ```
   
   url： yoursite/auth/reset_pass//其实是auth/reset_pass?token=${token}&email=${to}
   method: get 
   response:      
   //error:    status : 401
    {
        error: '链接已失效，请重新申请密码重置'
    }
    //success   status : 200，需存下，重置密码的post请求需要
    {
        email: ,
        token:
    }
    
    ```
    
    #### post
    
    ```
     url： yoursite/auth/reset_pass
     postbody:{
        pass:
        confirmPass:
        token:
        email
     }
     
     response跟登录差不多，分三种，422，401，200
     
    
    ```
    
    ### 登出
    
    不再赘述
    `/auth/signout`