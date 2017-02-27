/**
 * Created by luchen on 2017/2/27.
 */

const Report = require('../modelHelper').Report
const  reportListColumns = require('../constants/tableFields').reportListColumns
const config = require('../config')

exports.list = (req,res,next)=>{

    let {
        pageSize = config.pageSize,
        pageIndex = 1,
        orderBy = reportListColumns.createTime,
        desc = true,
        filter: {}
    } = req.query;

    desc = desc? -1 : 1;

    const query = {
        filter,
        options: {
            sort: {[orderBy]: desc},
            limit: pageSize,
            skip: pageSize * (pageIndex - 1)
        }
    }
    Report.getReportsByQuery(query,(err,reports)=>{
        if(err) return next(err);


    })


}