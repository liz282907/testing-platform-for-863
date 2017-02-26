/**
 * Created by luchen on 2017/2/26.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const fields = require('../constants/tableFields').flattenFields


const ReportSchema = new mongoose.Schema({

    creator_id: {type: Schema.Types.ObjectId ,required: true},        //报告的创建者,
    update_at:{type: Date,default:Date.now},
    create_at: {type: Date,default:Date.now},
    basic: {
        taskName: String,
        terminalType: String,
        inspector: String,          //检查人
        inspect_at: {type: Date,default:Date.now},
        remarks: String
    },
    items: fields
})
mongoose.model('Report',ReportSchema)