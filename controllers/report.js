/**
 * Created by luchen on 2017/2/21.
 */
const ep = require('eventproxy')
const util = require('../util/index').util
const Report = require('../modelHelper/index').Report
const User = require('../modelHelper/index').User
const fs = require('fs')
const path = require('path')
const config = require('../config')
// const markdownpdf = require("markdown-pdf")


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
        const result = util.formToMarkdown(report.items);
        fs.writeFile(`${fileName}.md`,result,(err)=>{
            if(err) return next(err);
            console.log("写入文件成功")
            fs.createReadStream(path.join(config.fileDir.src,fileName+'.md'))
                .pipe(markdownpdf())
                .pipe(fs.createWriteStream(path.join(config.fileDir.dest,fileName+'.pdf')))
        })
        // const fileName = report.basic.taskName;

    })
}

exports.download = (req,res,next)=> {
    const taskName = req.params.name;
    Report.getReportByName(taskName, (err, report) => {
        if (err) return next(err);
        const filePath = path.join(config.fileDir.dest,taskName+'.pdf')
        util.searchFile(filePath,next,(err,realFilePath)=>{
            if(err) return next(err);
            res.download(realFilePath,taskName,(err)=>{
                if (err) {
                    return next(err);
                } else {
                    console.log("success")
                    res.status(200).json({
                        success:'downloading'
                    })
                }
            })
        })
    })
}