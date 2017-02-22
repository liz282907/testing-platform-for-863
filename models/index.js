var mongoose = require('mongoose')
var config = require('../config')

mongoose.connect(config.db,function (err) {
    if(err){
        const customMsg = "connect to db: "+config.db +err.message;
        console.error(customMsg);
        process.exit(1);
    }

})

require('./user')
// require('./report')

exports.User = mongoose.model('User')