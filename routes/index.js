var express = require('express');
var router = express.Router();

var auth = require('./auth');
var report = require('./report')
var reports = require('./reports')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use('/auth',auth);
router.use('/report',report)
router.use('/reports',reports)
module.exports = router;
