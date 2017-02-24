/**
 * Created by luchen on 2017/2/21.
 */

var validator = require('validator')
var EventProxy = require('eventproxy')
var ep = new EventProxy()


const validateStrategy = {
    username: (username)=>{
        if(username.length<6) return '用户名长度至少6位'
    },
    pass: (pass,confirmPass)=>{
        if(pass!==confirmPass)return '两次密码不一致'

        if(!/\w{6,20}/.exec(pass)){
            return '请输入6-20位长度的密码'
        }
    },
    email: (email)=>{
        if(!validator.isEmail(email)) return '请输入符合要求的邮箱'
    }
}

class customValidate {
    constructor(strategy){
        this.queue = [];
        this.errMsgs = [];
        this.strategy = strategy;
    }
    add(field,...param){
        this.queue.push(()=> (this.strategy[field].apply(null,param)))
    }
    start(){
        this.queue.forEach(fn=>{
            const result = fn() || ''
            if(result) this.errMsgs.push(result)
        })
        this.queue = []
        return {
            valid: this.errMsgs.length<=0,
            msg: this.errMsgs
        }
    }
}
/**
 * 用户注册校验
 * @param {Object}req
 * @returns {Object} 校验结果{valid:,[msg]}
 */
exports.validate = function(req) {
    var username = validator.trim(req.body.username)
    var email = validator.trim(req.body.email)
    var pass = validator.trim(req.body.password)
    var confirmPass = validator.trim(req.body.confirmPass)

    if(!( username && email && pass && confirmPass )) return {valid: false,msg:
        ['信息不完整']}

    const validateObj = new customValidate(validateStrategy);
    validateObj.add('username',username);
    validateObj.add('pass',pass,confirmPass);
    validateObj.add('email',email);

    return validateObj.start();

    // validateStrategy[]
    //
    //
    //
    //
    //
    // if(!( username && email && pass && confirmPass )) return {valid: false,msg:'信息不完整'}
    // //length
    // if(username.length<6) return {valid: false,msg:'用户名长度至少6位'}
    //
    // if(!validator.isEmail(email)) return {valid: false,msg:'请输入符合要求的邮箱'}
    //
    // if(pass!==confirmPass)return {valid: false,msg:'两次密码不一致'}
    //
    // if(!/\w{6,20}/.exec(pass)){
    //     return { valid: false,msg: '请输入6-20位长度的密码'}
    // }
    // return {valid: true};
}



/**
 *
 * @param {Number} from
 * @constructor
 */
exports.moreThanOneDay = (from,to=Date.now())=>{
    const ONEDAY = 1000 * 60 * 60 *24
    return (from - to) > ONEDAY
}
