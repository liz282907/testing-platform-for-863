/**
 * Created by luchen on 2017/2/21.
 */
const express = require('express')
const router = express.Router()
const reports = require('../controllers/reports')

router.get('/',reports.list)




module.exports = router;