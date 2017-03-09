/**
 * Created by luchen on 2017/2/21.
 */
const EventProxy = require('eventproxy')
const util = require('../util/index').util
const Report = require('../modelHelper/index').Report
const User = require('../modelHelper/index').User
const fs = require('fs')
const path = require('path')
const config = require('../config')
const ep = new EventProxy()
const markdownpdf = require("markdown-pdf")


exports.showCreate = (req,res,next)=>{
    res.render('../public/index.html')
}

exports.createReport = (req,res,next)=>{
    const {basic,items} = req.body;

    const error = util.validateReport(req);
    if(error){
        return res.status(422).send({
            status: 422,
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
                status: 201,
                msg: '报告创建成功',
                data:''
            })

        })
        const fileName = report.basic.taskName;
        const result = util.formToMarkdown(report.items);
        const srcFilePath = path.join(config.fileDir.src,`${fileName}.md`);
        const destFilePath = path.join(config.fileDir.dest,`${fileName}.pdf`);
        fs.writeFile(srcFilePath,result,(err)=>{
            if(err) return next(err);
            console.log("写入文件成功")
            fs.createReadStream(path.join(config.fileDir.src,fileName+'.md'))
                .pipe(markdownpdf())
                .pipe(fs.createWriteStream(destFilePath))
        })


    })
}

exports.generateMarkdown = (taskName,next,cb)=>{

    Report.getReportByName(taskName, (err, report) => {
        if (err) return next(err);
        const filePath = path.join(config.fileDir.dest,taskName+'.pdf')
        const template = util.formToMarkdown(report.items);
        fs.writeFile(filePath,template,(err)=>{
            if(!err) return next(err);
            cb(filePath);
        });
    })


}

exports.download = (req,res,next)=> {
    const taskName = req.params.name;

    const filePath = path.join(config.fileDir.dest,taskName+'.pdf');
    util.searchFile(filePath,next,(err,realFilePath)=>{
        if(err) return next(err);
        if(realFilePath) ep.emit('fileReady',realFilePath);
        else{
            exports.generateMarkdown(taskName,next,ep.done('fileReady'));
        }
    })
    ep.on('fileReady',(realFilePath)=>{
        ep.unbind('fileReady')
        res.download(realFilePath,taskName,(err)=>{
            if (err) {
                return next(err);
            } else {
                console.log("success")
                res.status(200).json({
                    status: 201,
                    success:'downloading'
                })
            }
        })
    })
}