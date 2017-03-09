/**
 * Created by luchen on 2017/2/27.
 */
const Promise = require('bluebird')
const Report = require('../modelHelper/index').Report
const  reportListColumns = require('../constants/tableFields').reportListColumns
const util = require('../util/index').util

const config = require('../config')


const normalizeQuery = (query)=>{
    let {
        pageSize = config.pageSize,
        pageIndex = 1,
        orderBy = reportListColumns.inspectTime,
        desc = true,
        filter = {filterBy: 'basic.taskName',filterValue:''}
    } = query;

    desc = desc? -1 : 1;

    if(filter.filterBy.indexOf('basic')===-1) filter.filterBy = 'basic'+ filter.filterBy;

    if(!filter.filterValue) filter = {}
    else filter =  {[filter.filterBy]: filter.filterValue}

    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex)

    const normalizedQuery = {
        filter,
        options: {
            sort: {[orderBy]: desc},
            limit: pageSize,
            skip: pageSize * (pageIndex - 1)
        }
    }
    return normalizedQuery;
}
exports.list = (req,res,next)=>{

    const query = normalizeQuery(req.query);


    //获取报告列表，同时将creatorid替换为创建人的username
    const reportListPromise = Report.getReportsByQuery(query);
    const totalCountPromise = Report.getReportsByQuery();
    Promise.all([reportListPromise,totalCountPromise]).spread((reports,count)=>{
        const normalizedReport = util.normalizeReport(reports);
        const sendData = Object.assign(
            {},
            normalizedReport,
            {
                total:count,
                status:200
            });
        res.status(200).json(sendData);
    }).catch(err=>{
        if(err) next(err);
    })
}

// exports.download = (req,res,next)=>{
//
//     const taskName = req.params.name;
//     Report.getReportsByQuery({filter: {taskName}},(err,report)=>{
//         if(err) return next(err);
//
//         console.log(util.formToMarkdown(report.items));
//     })
//
// }