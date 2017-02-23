/**
 * Created by luchen on 2017/2/23.
 */
const uuid = require('uuid/v1')
const config = require('../config')



exports.genSessionID = (res)=>{

    const sessionId =  uuid();
    var options = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };

    res.cookie(config.cookie_name,sessionId,options)
}