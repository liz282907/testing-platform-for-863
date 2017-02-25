const mongoose = require('mongoose')
const config = require('../config')

mongoose.connect(config.db,function (err) {
    if(err){
        const customMsg = "connect to db: "+config.db +err.message;
        console.error(customMsg);
        process.exit(1);
    }

});

const db = mongoose.connection;
db.on('error',(err)=>{console.error(err.stack)});

require('./user')
// require('./report')co

exports.User = mongoose.model('User')
exports.connection = db