var express = require('express');
var TranscationDao = require('../data/TranscationDao');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var transcation = TranscationDao.getList();
  console.log(transcation);
  res.render('index', {transcation: transcation});
});

module.exports = router;
