const mongoose = require('mongoose')
const config = require('../config')

const DATABASE = config.testdb
mongoose.connect(DATABASE,function (err) {
    if(err){
        const customMsg = "connect to db: "+DATABASE +err.message;
        console.error(customMsg);
        process.exit(1);
    }

});

const db = mongoose.connection;
db.on('error',(err)=>{console.error(err.stack)});

require('./user')
require('./report')

exports.User = mongoose.model('User')
exports.Report = mongoose.model('Report')
exports.connection = db