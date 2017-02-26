/**
 * Created by luchen on 2017/2/21.
 */
const ep = require('eventproxy')
const util = require('../util/index').util
const Report = require('../modelHelper/index').Report
const User = require('../modelHelper/index').User

exports.createReport = (req,res,next)=>{

}

exports.showCreate = (req,res,next)=>{
    res.render('../public/index.html')
}

exports.createReport = (req,res,next)=>{
    const {basic,items} = req.body;

    const error = util.validateReport(req);
    if(error){
        return res.status(422).send({
            error,
            basic,
            items
        })
    }
    const curUserId = req.session.user._id;
    Report.createAndSave({basic,items},curUserId,(err)=>{
        if(err) return next(err);
        req.session.user.reportCount++;
        // req.session.user.save();
        User.getUserById(curUserId,(err,user)=>{
            console.log("------in mongo ",user);
            console.log("------in session ",req.session.user);
            console.log("------比较 ",user===req.session.user);

        })
        res.status(200).json({
            success: '文件创建成功'
        })

    })


}