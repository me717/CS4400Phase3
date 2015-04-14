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
        req.session.username = results[0].username;
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
        // username: req.query.username,
        username: req.session.username,
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
    var query = "SELECT Book.isbn AS isbn, Book.title AS title, " + 
                "BookCopy.copyNumber AS copyNumber, " + 
                "Authors.name AS author, COUNT(*) AS numberAvailable " +
                "FROM Book JOIN Authors ON Book.isbn = Authors.isbn " +
                "JOIN BookCopy ON Book.isbn = BookCopy.isbn " +
                "WHERE (Authors.name = '{author}' OR {author} IS NULL) " +
                "(Book.title = '{title}' OR {title} IS NULL) " +
                "(Book.isbn = '{isbn}' OR {isbn} IS NULL) " + 
                "AND (BookCopy.isCheckedOut = 0) " +
                "AND (BookCopy.isOnHold = 0) " +
                "AND (BookCopy.isDamaged = 0) " +
                "GROUP BY Book.isbn ";
    query = format(query, {
        isbn: req.query.isbn,
        edition: req.query.edition,
        author: req.query.author,
        title: req.query.title
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

router.post('/placeHold', function(req, res, next) {
    var updateQuery = "UPDATE BookCopy SET isOnHold = 1, futureRequester = NULL " +
                "WHERE isbn = {isbn} AND copyNumber = {copyNumber} " +
                "AND isOnHold = 0 AND isCheckedOut = 0 " + 
                "AND isDamaged = 0";
    updateQuery = format(updateQuery, {
        isbn: req.query.isbn,
        copyNumber: req.query.copyNumber
    });
    executeQuery(updateQuery, function(error, results, fields) {
        if(error) {
            res.status(500);
            res.send(error);
        }
    });

    var insertQuery = "INSERT INTO Issues (username, isbn, copyNumber, " + 
                        "dateOfIssue, returnDate, extensionDate, countOfExtensions) " +
                        "SELECT username, '{isbn}', {copyNumber}, " + 
                        "CURDATE(), DATE_ADD(CURDATE(), CURDATE(), INTERVAL 17 DAY), 0 " +
                        "FROM StudentAndFaculty WHERE username = '{username}' AND isDebarred = 0";
    insertQuery = format(insertQuery, {
        isbn: req.query.isbn,
        copyNumber: req.query.copyNumber,
        username: req.session.username
        // username: req.query.username
    });
    executeQuery(insertQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

router.post('/extension', function(req, res, next) {

});

//Future Request Search Book
router.get('/futureRequestSearch', function(req, res, next) {
    var query = "SELECT BookCopy.copyNumber AS copyNumber, " +
                "Issues.ReturnDate AS availableDate " +
                "FROM BookCopy LEFT JOIN Issues ON " +
                "BookCopy.isbn = Issues.isbn AND " + 
                "BookCopy.copyNumber = Issues.copyNumber)" +
                "WHERE BookCopy.isbn = '{isbn}' " +
                "AND BookCopy.futureRequester IS NULL "
                "AND (DATEDIFF(CURDATE(), Issues.ReturnDate) < 0 " +
                    "OR Issues.ReturnDate IS NULL) " +
                "AND BookCopy.isOnHold = 0 " +
                "ORDER BY availableDate DESC " +
                "LIMIT 1";
    query = format(query, {
        isbn: req.query.isbn
    });
    executeQuery(insertQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Future Request Place
router.get('futureRequestPlace', function(req, res, next) {
    var query = "UPDATE BookCopy SET futureRequester = '{username}' " +
                "WHERE BookCopy.isbn = '{isbn}' " + 
                "AND BookCopy.copyNumber = {copyNumber}";
    query = format(query, {
        username: req.session.username,
        isbn: req.query.isbn,
        copyNumber: req.query.copyNumber
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
    var query = "SELECT isbn, copyNumber FROM Issues WHERE issueId = {issueId} AND DATEDIFF(CURDATE(), returnDate) < 0";
    query = format(query, {
        issueId: req.query.issueId
    });
    var isbn;
    var copyNumber;
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        } else if (results.length) {
            isbn = results[0].isbn;
            copyNumber = copyNumber[0].copyNumber;
        } else {
            res.status(200);
            res.send({message: "Hold has expired"});
        }
    });
    var updateQuery = "UPDATE BookCopy SET isOnHold =  0, isCheckedOut = 1" +
                "WHERE isbn = {isbn} AND copyNumber = {copyNumber} ";
    updateQuery = format(updateQuery, {
        isbn: isbn,
        copyNumber: copyNumber
    });
    executeQuery(updateQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//return
router.post('/return', function(req, res, next) {
    var issuesQuery = "SELECT Issues.username AS username, " +
                        "Issues.returnDate AS returnDate " +
                    "FROM Issues WHERE Issues.isbn = '{isbn}' " +
                     "AND Issues.copyNumber = '{copyNumber}' " +
                    "ORDER BY returnDate DESC " +
                    "LIMIT 1";
    issuesQuery = format(issuesQuery, {
        isbn: req.query.isbn,
        copyNumber: req.query.copyNumber
    });
    var username;
    var returnDate;
    executeQuery(issuesQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        username = results[0].username;
        returnDate = results[0].returnDate;
    });

    var penaltyQuery = "UPDATE StudentAndFaculty " +
                        "SET penalty = penalty + DATEDIFF(CURDATE(), $returnDate) * 0.5 "
                        "WHERE username = '{username}' " +
                        "AND DATEDIFF(CURDATE(), {returnDate}) > 0";
    penaltyQuery = format(penaltyQuery, {
        username: username,
        returnDate: returnDate
    });
    executeQuery(penaltyQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
    });

    var returnQuery = "UPDATE BookCopy SET isDamaged = {isDamaged}, isCheckedOut = 0 " +
                        "WHERE BookCopy.copyNumber = {copyNumber} " +
                        "AND BookCopy.isbn = '{isbn}'";
    executeQuery(returnQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
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