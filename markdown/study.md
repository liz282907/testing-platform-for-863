1. hash.update()方法就是将字符串相加，然后在hash.digest()将字符串加密返回
2. client先用certificate（得到server公钥）验证server身份，然后用这个公钥解密server发来的
hello信息，ssl验证身份完以后 client随机生成一个大数，用server的公钥加密，传过去，server来解密得到，以后
就用这个随机数作为master secret,然后双方用master secret生成最后的sessionkey，作为对称加密的key

3. crypto：

 - 不可逆，hash里面的hash模块，hmac模块（放置彩虹表攻击，在hash的基础上加了一个key）

    hash中，常用的用sha1就可以，时间长度都还可以，md5（32位）
    
    ```
    //对于登录密码，可以存key+密文，彩虹表也推不出来
    //对于登陆密码来说，是不需要考虑解密的，通常都会用不可逆的算法，像md5,sha-1等
    {
      username: 'xxxx'
      password: 'aead69a72da77d0615a854dda1086d885807574a',
      passkey:'abc'
    }
    ```
  - 可逆算法，crypto里面也有支持，cipher,decipher
  
  rc4和aes-256-cbc是表现不错的算法，加密和解密时间都比较短，
  加密时间:解密时间=1:3；对于服务端加密，客户端解密的，aes-256-cbc算法的计算时间比例就可以。
  
  - 签名和认证
  
    还需要判断数据在传输过程中，是否真实际和完整，是否被篡改了。那么就需要用到签名和验证的算法，利用不对称加密算法，通过私钥进行数字签名，公钥验证数据的真实性。
    
    签名： data -> hashedData -> 私钥加密 + 证书 -> 签名后的。
    解密： 更复杂一点的是，用认证机构的公钥去解密证书，得到公钥，用这个公钥（与签名者给的公钥比对，看是否是正确的公钥，签名者对不对）（**这边验证了通信双方**），
    用这个公钥去 解密 加密的数据，得到hashedData. === hash（data）.（**这边验证数据是否完整**）
    都正确的话就是身份认证结束
    
    openssl命令生成公私钥，用私钥与数据得到数字签名（sign），用公钥，数据，数字签名去verifyverify(algorithm,pubkey,sig,data)
    
    salt： hash(text+salt)  crypto.pbkdf2()函数，默认会调用hmac算法，用sha1的散列函数，并且可以设置迭代次数和密文长度
    salt也可以随机
    
    
    
 4. bcrypt与native crypto库里面的方法的区别：
    
    bcrypt因为采用了Blowfish 算法， which has a computationally expensive key setup phase。常用于slow 加解密，比如那些不想让attacker获取的
    数据，比如 password,而crypto可以用于任何regular的情况，比如hmac也行。
 
 5. mongo命令
 
     ```
     db.users.update({username:'some'},{$set:{"pass":"barrymore"}}) 
     ```
 
 6. 用户注册
 逻辑上，注册完成后（假设要邮箱验证），则hash(name,pass,secret),生成一个token给邮件的链接
 
     ```javascript
     
      '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' 
  
     ```
 
    然后用户请求激活账户这个action，后端用a标签中的token与自己存的token进行比对，看是否是用户发送的请求（csrf攻击的防范）
 
    如果不需要邮箱验证，则直接后端调用login 的action（把刚刚得到的pass，与存进数据库的hash的pass传给verify的函数），验证成功。
    
    然后再generateSessionID,(每次登录过后都要重新生成)，那么从登录到下一次登陆之前的请求，都用这个sessionId来验证
    
 7. res.cookie中的{signed:true}到底做了什么操作
 
     因为signed本质是用hmac对data(plain cookie)做了处理，之前我们讲签名的时候就提到过，对data去hash一遍，这个hash就采用的hmac，因此要用到额外
     的key(secret)，就是传给cookieParser(key)的值，（本质做加盐防彩虹表），~~然后用底层的私钥去做了加密处理~~，最终设置到cookie里面。
     楼主看了下这部分的代码，其实并没有做想象中的signed，（跟上面的openssl里面的数字签名还是不一样的）。cookie-parse调用了
     **node-cookie-signature**中的[sign](https://github.com/tj/node-cookie-signature/blob/60f3be29232145e445aada51d520d370b0a52161/index.js#L16)和unsign函数
     
     ```Javascript
        exports.sign = function(val, secret){
          if ('string' != typeof val) throw new TypeError('cookie required');
          if ('string' != typeof secret) throw new TypeError('secret required');
          return val + '.' + crypto
            .createHmac('sha256', secret)
            .update(val)
            .digest('base64')
            .replace(/\=+$/, '');
        };
        //hmac(data,secret) => 'data.signedData'
    
    ```
    实际上只做了一次hmac的加密。
    当服务端收到req时，可以用req.signedCookies来访问解析后的cookie,本质是用[cookie-parser来解析](https://github.com/expressjs/cookie-parser/blob/master/index.js#L128)传过来的signedcookie
    需要注意的是用cookie-parser中间件的时候要传入secret,否则不会启用signedCookie
    
    ```javascript
    function signedCookie (str, secret) {
    
          //...省略部分代码，具体见链接
          for (var i = 0; i < secrets.length; i++) {
            var val = signature.unsign(str.slice(2), secrets[i])
        
            if (val !== false) {
              return val
            }
          }
        
          return false
        }
    //node-cookie-signature 包
    exports.unsign = function(val, secret){//val: 签名了的cookie(在express这边返回的实际上是刑如：`${plainCookie}.${sign(plainCookie,secret}`的值)）
      if ('string' != typeof val) throw new TypeError('cookie required');
      if ('string' != typeof secret) throw new TypeError('secret required');
      var str = val.slice(0, val.lastIndexOf('.'))
        , mac = exports.sign(str, secret);     //用plainCookie，与secret去再次hmac得到的值，与收到的signed去比对，因为hmac不可逆..所以需要知道原始的plainData去重复操作验证
      // 因为收到的是plain.signed 这个整体。（因为secret是server私有的（重点！，attacker无法知晓）），所以如果更改了这个,就会导致验证失败。
      // 原始： var a = hmac('123','secret') => '123.a'， 如果attacker更改为'123.b' hmac(123,secret)！== '123.b'，验证失败
       //疑问就是，那这个都仰仗secret的话，不是可以穷举secret么...因为express这边显示的把plain给写出来了，应该很容易穷举啊.
       //普通的hmac是不好破解的，因为我们知道它本身就是防范彩虹表攻击的，但是在express这边，感觉有点不安全...
   
      return sha1(mac) == sha1(val) ? str : false; //如果验证成功的话返回str,就是req.signedCookie
    };


    ```
    
    小结：
    
    - 为什么要session，不用cookie？
    
        答： session存放在服务端，通常情况下不会被窃取。
    - 为什么要session 随机 & 每次登陆后都重新生成
    
        答： 随机，不容易被爆破，每次重新生成是防止一次窃取后每次都可以用它登陆。
    
    - session跟signedCookie有什么关系
    
        答： 没有= =，两者不冲突，signedCookie只是用来防止数据[被篡改的](http://www.ciphertech.com.tw/Datasheet/imperva/knowledgeBase/Cookie_Poisoning.htm)，session是用来验证身份的，有可能身份验证正确但是数据被篡改，因此cnode中同时设置了这个，
    并且可以设置httpOnly缓解XSS攻击（js不能访问带有该属性的cookie）。（因为cookie其实还是会被窃取的。）
    
    - signedCookie关键在于 默认 secret是private的
    
    - 补充： httpOnly是使得js不能访问带有该属性的cookie，同源策略是使得不能跨域访问
    
    
    
   【碎碎念】：楼主装了editThisCookie的插件，里面有这么几个选项
    ![](http://p1.bqimg.com/567571/09169556d6276b44.jpg)
    
   分别是，secure:是否启用https, session:是否是session-cookie(与有expiration的固定cookie相对，每次关闭浏览器后就会erase掉，而
    persistent cookie则是除非expire或者手动erase，否则不会清除，他们都可以remember your action)
    
   There are two different types of cookies:
    
   > Session cookies - these are temporary and are erased when you close your browser at the end of your surfing session. The next time you visit that particular site it will not recognise you and will treat you as a completely new visitor as there is nothing in your browser to let the site know that you have visited before (more on session cookies).
    
   > Persistent cookies - these remain on your hard drive until you erase them or they expire. How long a cookie remains on your browser depends on how long the visited website has programmed the cookie to last (more on persistent cookies).
    
    
 8. 前端所知道的"一次登录后，maxAge时间内就不需要验证"，到底做了什么？
 
 实际上是，登录后，server生成随机的sessionID信息放到cookie/signedCookie里面，（并）然后下次req的时候，会自动携带cookie信息，
 那么server对cookie里面的sessionID读取，并根据这个sessionID，去查与user的映射关系（就是存放session的地方，比如数据库），如果查找成功，则说明当前用户验证成功，
 然后在maxAge时间内都进行这个操作，
 
 所以说，不需要验证只是对前台不可见，实际上还是要做的。
 
 （cnode的后台部分，就是把每一个请求的这一验证部分抽取成了authUser的中间件，先进行这一步操作，并挂在了req.session上，目的有二：
     - 一是不要每次深层次查找数据，可以理解为一个快捷方式
     - 另一方面其实是用了类似于[connect-mongo](https://github.com/jdesboeufs/connect-mongo/blob/master/src/index.js/#L193)的store中间件，用于sessionID与req.session的映射关系的存取，内部可以触发session存到store里面，监听maxAge等等，相当于用另外一张表来存取映射关系，而不是直接放在user表里面）
     
 楼主后来又看了下[session库](https://sourcegraph.com/github.com/expressjs/session@master/-/blob/index.js#L95:29-95:33)，大致做了这么些操作，刚开始请求的时候，检查cookie信息，去设置req.sessionID,如果发现没有，则generate一个sessionID,req.session对象（Session类对象），进入next()，即后续
 的其他路由、中间件等，但是在里面其实还做了两件事件：
 
 - 一个是onHeader函数，即，在要向浏览器发送数据包的时候，去[setCookie](https://github.com/expressjs/session/blob/master/index.js/#L242). 
 - 另一件是包抄res.end函数，在里面多加了一个
 [save到store](https://github.com/expressjs/session/blob/master/session/session.js/#L71)的过程，即以sessionID为key，把req.session对象写入数据库中。
 
     ```javascript
     //用上面提到的node-cookie-signature去签名，（hmac(sessionID,secret)） -> setCookie(name,signedCookie)
        setcookie(res, name, req.sessionID, secrets[0], req.session.cookie.data);
    ```
 
 以后每次请求都直接读取req.session即可。也就是说，简化了每次从req.cookie里面解析sessionID,然后查找之前建立的sessionid->user的映射表，以及后续的
 超时自动清除数据表等等其他收尾工作。维持一个"全局"对象（req.session）在一个登录有效期（多req）内持久存在的目的。
 
 而用了session的中间件，你所需要做的就是告诉它name，secret(用于签名)，即可（不告诉genid的函数都可以，内部它用uid去创建的），然后
 把要放到cookie里面的东西挂在req.session对象上...奏是这么简单...
 
     
 9. save的options说明
 
    - sessionresave : 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    - Uninitialized: 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    secure: 应用在https
 
   ---
    
    
  ### reference
    
   - [Node.js加密算法库Crypto](http://ju.outofmemory.cn/entry/118198)
   - [NodeJS: bcrypt vs native crypto](http://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto)
   - [What are “signed” cookies in connect/expressjs?](http://stackoverflow.com/questions/11897965/what-are-signed-cookies-in-connect-expressjs)
   - [all about cookie](http://www.allaboutcookies.org/manage-cookies/index.html)