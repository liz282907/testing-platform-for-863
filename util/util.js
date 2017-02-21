/**
 * Created by luchen on 2017/2/21.
 */

var validator = require('validator')
var EventProxy = require('eventproxy')
var ep = new EventProxy()



exports.validate = function(req) {
    var username = validator.trim(req.body.username)
    var email = validator.trim(req.body.email)
    var pass = validator.trim(req.body.password)
    var confirmPass = validator.trim(req.body.confirmPass)


    if(!( username && email && pass && confirmPass )) return {valid: false,msg:'信息不完整'}
    //length
    if(username.length<6) return {valid: false,msg:'用户名长度至少6位'}

    if(!validator.isEmail(email)) return {valid: false,msg:'请输入符合要求的邮箱'}

    if(pass!==confirmPass)return {valid: false,msg:'两次密码不一致'}

    if(!/\w{6,20}/.exec(pass)){
        return { valid: false,msg: '请输入6-20位长度的密码'}
    }
    return {valid: true};
}
