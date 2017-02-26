/**
 * Created by luchen on 2017/2/21.
 */
const express = require('express')
const router = express.Router()
const auth = require('../middleWares/auth')
const report = require('../controllers/report')

router.get('/create',auth.userRequired,report.showCreate)
router.post('/create',auth.userRequired,report.createReport)




module.exports = router;