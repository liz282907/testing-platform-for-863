/**
 * Created by luchen on 2017/2/21.
 */

var validator = require('validator')
var EventProxy = require('eventproxy')
var config = require('../config.js')
var ep = new EventProxy()
var fs = require('fs')
const path = require('path')
const markdownpdf = require("markdown-pdf")
const tableFields = require('../constants/tableFields')


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
 * 用于电子邮件的token时间有效期的验证，from,to均为 Date.now()所指示的milliseconds
 * @param {Number} from
 * @constructor
 */
exports.moreThanOneDay = (from,to=Date.now())=>{
    const ONEDAY = 1000 * 60 * 60 *24
    return (from - to) > ONEDAY
}


exports.validateReport = (req,res,next)=>{
    const {basic,items} = req.body;

    if(!basic.taskName) return '任务名不能为空'
}

exports.normalizeReport = (report)=>{

    let reportList = report;

    if(!Array.isArray(report)){
        reportList = [report]
    }
    if(!reportList.length) return [];
    return reportList.map(report=>{
        const {items,basic,creator_id} = report
        return {
            items,
            basic,
            creator: creator_id.username
        }
    })

}

exports.formToMarkdown = (formData)=>{
    return tableFields.generateMarkdown(formData);
}

/**
 * 就是给定文件路径，access查看是否存在，不在的话，去各个目录下找同名文件（不包括后缀，），
 * 如果找到的话，触发findFile事件，如果发现后缀也一样，则返回path,不一样，则去转成pdf，然后返回pathname.
 */
exports.searchFile = (prevPath,cb)=>{
    const fileName = path.basename(prevPath,path.extname(prevPath));

    ep.on('findFile',(filePath)=>{
        if(path.extname(filePath) ==='.pdf') return cb(null,filePath);

        //同名文件，尚未转为pdf
        markdownpdf().from(filePath).to(path.join(config.fileDir.dest,fileName+'.pdf'), function () {
            console.log("文件创建成功，Done")
            ep.emit('findFile',config.fileDir.dest,fileName+'.pdf');
        })

        // fs.createReadStream(filePath)
        //     .pipe(markdownpdf())
        //     .pipe(fs.createWriteStream(path.join(config.fileDir.dest,fileName+'.pdf')))
    })
    ep.on('retrySearch',(path)=>{
        Object.keys(config.fileDir).forEach((dirName)=>{
            fs.readdir(dirName,ep.done(files=>{
                files.forEach(filename=> {
                    if(filename.indexOf(fileName)!==-1){
                        ep.done('findFile',path.join(dirName,filename));
                        return
                    }
                });
            }));
        })

    })

    ep.fail(cb);

    fs.access(prevPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if(err) return ep.done('retrySearch');
        ep.emit('findFile',prevPath);
    });
}