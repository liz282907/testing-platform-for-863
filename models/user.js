const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    pass: {type: String, required: true},

    token: String,
    retrieveTime: Number,

    reports: [{type: mongoose.Schema.Types.ObjectId,ref:'Report'}],
    reportCount: {type: Number,default: 0}

})
mongoose.model('User',UserSchema)