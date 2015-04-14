var express = require('express');
var mysql = require('mysql');
var format = require('string-template');

var credentials = require('./credentials');
var router = express.Router();

//Login
router.get('/login', function(req, res, next) {
    var query = "SELECT username FROM User WHERE '{username}' = username";
    query = query + " AND '{password}' = password";
    query = format(query ,{
                        username: req.query.username,
                        password: req.query.password
    });
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);

    });
});

//Register
router.post('/register', function(req, res, next) {
    var query = "INSERT INTO User(username, password)"
    query = query + "VALUES ('{username}', '{password}')";
    query = format(query, {
        username: req.query.username,
        password: req.query.password
    });
    executeQuery(query, function(error, results, fields) {
        if(!error) {
            res.status(200);
            res.send(results);
        } else {
            //TODO error handling
            res.status(500);
            res.send(error);        }
    });
});

//Create Profile
router.post('/profile', function(req, res, next){
    var query = "INSERT INTO StudentAndFaculty" +
                    "(username, firstName, lastName, dob, gender, email, " +
                    "address, isFaculty, dept) VALUES " +
                    "({username}, {firstName}, {lastName}, {dob}, {gender}, {email}, " +
                    "{address}, {isFaculty}, {dept})";
    query = format(query, {
        username: req.query.username,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        dob: req.query.dob,
        gender: req.query.dob,
        email: req.query.email,
        address: req.query.address,
        isFaculty: req.query.isFaculty,
        dept: req.query.dept
    });
    executeQuery(query, function(error, results, fields){
        if(!error) {
            res.status(200);
            res.send(results);
        } else {
            //TODO error handling
            res.status(500);
            res.send(error);
        }
    })
});

//Search Books
router.get('/searchBooks', function(req, res, next) {
    var query = "SELECT Book.isbn AS isbn, Book.title AS title, Book.publisher AS publisher, " +
                "Book.edition AS edition, BookCopy.copyNumber AS copyNumber, " + 
                "Authors.name AS author, COUNT(*) AS numberAvailable " +
                "FROM Book JOIN Authors ON Book.isbn = Authors.isbn " +
                "JOIN BookCopy ON Book.isbn = BookCopy.isbn " +
                "WHERE (Authors.name = '{author}' OR {author} IS NULL) " +
                "(Book.title = '{title}' OR {title} IS NULL) " +
                "(Book.isbn = '{isbn}' OR {isbn} IS NULL) " + 
                "(Book.edition = '{edition}' OR {edition} IS NULL) " +
                "(Book.title = '{publisher}' OR {publisher} IS NULL) " +
                "AND (BookCopy.isCheckedOut = 0) " +
                "AND (BookCopy.isOnHold = 0) " +
                "AND (BookCopy.isDamaged = 0) " +
                "GROUP BY Book.isbn ";
    query = format(query, {
        isbn: req.query.isbn,
        edition: req.query.edition,
        author: req.query.author,
        title: req.query.title,
        publisher: req.query.publisher
    });
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Future Hold Request
router.post('/futureHold', function(req, res, next) {

});


//Track location
router.get('/trackLocation', function(req, res, next) {
    var query = "SELECT Book.shelfNumber, Shelf.aisleNumber, " +
                "Floor.floorNumber, Book.subjectName " + 
                "FROM Book " +
                "JOIN Shelf ON Book.shelfNumber = Shelf.shelfNumber " +
                "JOIN Floor ON Shelf.floorNumber = Floor.floorNumber " +
                "WHERE Book.isbn = '{isbn}'";
    query = format(query, {
        isbn: req.query.isbn
    });
    console.log(query);
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//checkout
router.post('/checkout', function(req, res, next) {

});

//return
router.post('/return', function(req, res, next) {

});

//penalty
router.post('/penalty', function(req, res, next) {

});

//Damaged Books Report
router.get('/damagedBooksReport', function(req, res, next) {

});

//Popular Books Report
router.get('/popularBooksReport', function(req, res, next) {

});

//Frequent User Report
router.get('/frequentUserReport', function(req, res, next) {

});

//Popular Subject Report
router.get('/popularSubjectReport', function(req, res, next) {

});

//HELPER FUNCTION
function executeQuery(query, callback) {
    var connection = mysql.createConnection(credentials);
    connection.connect(function(err) {
        if(err) {
            console.log(err);
			//TODO error handling
		} 
    });
    connection.query(query, callback);
}
module.exports = router;