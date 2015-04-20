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

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Create Profile' });
});

/* GET search page. */
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search Books' });
});

/* GET search page. */
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search Books' });
});

/* GET request hold page. */
router.get('/hold', function(req, res, next) {
  res.render('hold', { title: 'Request Hold' });
});

/* GET request extension page. */
router.get('/extension', function(req, res, next) {
  res.render('extension', { title: 'Request Extension' });
});

/* GET future hold request page. */
router.get('/futurehold', function(req, res, next) {
  res.render('futurehold', { title: 'Future Hold Request for a Book' });
});

/* GET track book location page. */
router.get('/track', function(req, res, next) {
  res.render('track', { title: 'Track Book Location' });
});

/*
 *
 *
 * STAFF ONLY PAGES
 *
 *
 */

 /* GET book checkout page. */
 router.get('/checkout', function(req, res, next) {
   res.render('checkout', { title: 'Book Checkout' });
 });

 /* GET return book page. */
 router.get('/return', function(req, res, next) {
   res.render('return', { title: 'Return Book' });
 });

 /* GET lost/damaged book page. */
 router.get('/lostdamaged', function(req, res, next) {
   res.render('lostdamaged', { title: 'Lost/Damaged Book' });
 });

 /* GET damaged book report */
 router.get('/damagedreport', function(req, res, next) {
   res.render('damagedreport', { title: 'Damaged Book Report' });
 });

 /* GET popular books report */
 router.get('/popularreport', function(req, res, next) {
   res.render('popularreport', { title: 'Popular Books Report' });
 });

 /* GET frequent users report */
 router.get('/frequentreport', function(req, res, next) {
   res.render('frequentreport', { title: 'Frequent Users Report' });
 });

 /* GET popular subjects report */
 router.get('/subjectreport', function(req, res, next) {
   res.render('subjectreport', { title: 'Popular Subjects Report' });
 });

module.exports = router;