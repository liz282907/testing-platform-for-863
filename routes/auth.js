/**
 * Created by luchen on 2017/2/21.
 */
var express = require('express')

var auth = require('../controllers/auth')

var router = express.Router()

//注册
router.get('/signup',auth.showSignup)
router.post('/signup',auth.signup)

//登出
router.post('/signout',auth.signout)

//登录
router.get('/signin',auth.showSignin)
router.post('/signin',auth.signin)

//重置密码
router.post('/reset_pass',auth.updatePassword)
router.get('/reset_pass',auth.showResetPage)

router.get('/retrieve_pass',auth.showRetrievePass)
router.post('/retrieve_pass',auth.retrievePass)


module.exports = router;