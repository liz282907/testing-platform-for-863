const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    pass: String,

    token: String,
    retrieveTime: Number

})
mongoose.model('User',UserSchema)