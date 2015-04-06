var express = require('express');
var mysql = require('mysql');
var credentials = require('./credentials');
var router = express.Router();

/* LOGIN. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Database' });
});

module.exports = router;