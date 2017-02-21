var express = require('express');
var router = express.Router();

var auth = require('./auth');
var report = require('./report')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use('/auth',auth);
// router.use('/report',report)

module.exports = router;
