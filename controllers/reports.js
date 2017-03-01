/**
 * Created by luchen on 2017/2/27.
 */

const Report = require('../modelHelper/index').Report
const  reportListColumns = require('../constants/tableFields').reportListColumns
const util = require('../util/index').util

const config = require('../config')

exports.list = (req,res,next)=>{

    let {
        pageSize = config.pageSize,
        pageIndex = 1,
        orderBy = reportListColumns.createTime,
        desc = true,
        filter = ''
    } = req.query;

    desc = desc? -1 : 1;
    filter = filter? {'basic.taskName': filter}: {}

    const query = {
        filter,
        options: {
            sort: {[orderBy]: desc},
            limit: pageSize,
            skip: pageSize * (pageIndex - 1)
        }
    }
    //获取报告列表，同时将creatorid替换为创建人的username
    Report.getReportsByQuery(query,(err,reports)=>{
        if(err) return next(err);
        res.status(200).json(util.normailizeReport(reports));
    })


}