/**
 * Created by luchen on 2017/2/22.
 */
const bcrypt = require('bcrypt')

exports.hash = function (pass,cb) {
    bcrypt.hash(pass,10,cb)
}

exports.compareHash = (pass,hashedPass,cb)=>{
    bcrypt.compare(pass, hashedPass, cb);
}

