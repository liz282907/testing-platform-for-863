var mongoose = require('mongoose')


var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    pass: String
})
mongoose.model('User',UserSchema)