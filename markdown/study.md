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
    解密： 更复杂一点的是，用认证机构的公钥去解密证书，得到公钥，用这个公钥（与签名者给的公钥比对，看是否是正确的公钥，签名者对不对），
    用这个公钥去 解密 加密的数据，得到hashedData. === hash（data）.
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
    ---
    
  ### reference
    
   - [Node.js加密算法库Crypto](http://ju.outofmemory.cn/entry/118198)
   - [NodeJS: bcrypt vs native crypto](http://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto)
    
    