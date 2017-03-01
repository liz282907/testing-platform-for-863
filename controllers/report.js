/**
 * Created by luchen on 2017/2/21.
 */
const ep = require('eventproxy')
const util = require('../util/index').util
const Report = require('../modelHelper/index').Report
const User = require('../modelHelper/index').User
const fs = require('fs')


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
    Report.createAndSave({basic,items},curUserId,(err,report)=>{
        if(err) return next(err);

        User.getUserById(curUserId,(err,user)=>{

            user.reports.push(report._id);
            user.save();
            req.session.user = user;
            res.status(201).send({
                success: '报告创建成功'
            })
        })


    })


}

exports.download = (req,res,next)=> {

    const taskName = req.params.name;
    Report.getReportByName(taskName, (err, report) => {
        if (err) return next(err);

        const result = util.formToMarkdown(report.items);
        fs.writeFile('testmd.md',result,(err)=>{
            if(err) return next(err);
        })

        console.log(util.formToMarkdown(report.items));
        res.status(200).json({
            success:'downloading'
        })
    })
}