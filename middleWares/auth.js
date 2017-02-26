/**
 * Created by luchen on 2017/2/23.
 */
const uuid = require('uuid/v1')
const config = require('../config')


/**
 * 生成随机的sessionID,存放于cookie中
 */
exports.genSessionID = (res)=>{

    const sessionId =  uuid();
    var options = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };

    res.cookie(config.cookie_name,sessionId,options)
}
/**
 * 生成链接中的token，防止csrf攻击
 */
exports.genToken = ()=>{
    return uuid();
}

exports.userRequired = (req,res,next)=>{
    if(req.session && req.session.user){
        next()
    }else{
        return res.status(403).json({
            error: '您没有权限操作，请登录'
        })

    }
}