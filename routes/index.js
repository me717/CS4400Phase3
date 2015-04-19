var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

/* GET registration. */
router.get('/registration', function(req, res, next) {
  res.render('registration', { title: 'New User Registration' });
});

/* GET registration. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Create Profile' });
});

module.exports = router;