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
        if(results.length) {
            req.session.username = results[0].username;
            console.log(req.session.username);
            res.status(200);
            res.send(results);
        } else {
            res.status(500);
            res.send({message: "Invalid login"})
        }

    });
});

//Register
router.post('/register', function(req, res, next) {
    var query = "INSERT INTO User(username, password)"
    query = query + "VALUES ('{username}', '{password}')";
    query = format(query, {
        username: req.body.username,
        password: req.body.password
    });
    executeQuery(query, function(error, results, fields) {
        if(!error) {
            req.session.username = req.body.username;
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
                    "('{username}', '{firstName}', '{lastName}', '{dob}', '{gender}', '{email}', " +
                    "'{address}', {isFaculty}, '{dept}')";
    query = format(query, {
        // username: req.query.username,
        username: req.session.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        gender: req.body.dob,
        email: req.body.email,
        address: req.body.address,
        isFaculty: req.body.isFaculty,
        dept: req.body.dept
    });
    executeQuery(query, function(error, results, fields){
        if(!error) {
            res.status(200);
            res.send(results);
        } else {
            //TODO error handling
            res.status(500);
            error.query = query;
            res.send(error);
        }
    })
});

//Search Books
router.get('/searchBooks', function(req, res, next) {
    var query = "SELECT Book.isbn AS isbn, Book.title AS title, " + 
                "BookCopy.copyNumber AS copyNumber, " + 
                "Authors.name AS author, COUNT(*) AS numberAvailable, " +
                "Book.edition AS edition " +
                "FROM Book JOIN Authors ON Book.isbn = Authors.isbn " +
                "JOIN BookCopy ON Book.isbn = BookCopy.isbn " +
                "WHERE (Authors.name = '{author}' OR '{author}' = '') " +
                "AND (Book.title = '{title}' OR '{title}' = '') " +
                "AND (Book.isbn = '{isbn}' OR '{isbn}' = '') " + 
                "AND (BookCopy.isCheckedOut = 0) " +
                "AND (BookCopy.isOnHold = 0) " +
                "AND (BookCopy.isDamaged = 0) " +
                "AND (Book.isReserved = 0) " +
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
        } else {
            res.status(200);
            res.send(results);
        }
    });
});

router.get('/searchReservedBooks', function(req, res, next) {
    var query = "SELECT Book.isbn AS isbn, Book.title AS title, " + 
                "BookCopy.copyNumber AS copyNumber, " + 
                "Authors.name AS author, COUNT(*) AS numberAvailable, " +
                "Book.edition AS edition " +
                "FROM Book JOIN Authors ON Book.isbn = Authors.isbn " +
                "JOIN BookCopy ON Book.isbn = BookCopy.isbn " +
                "WHERE (Authors.name = '{author}' OR '{author}' = '') " +
                "AND (Book.title = '{title}' OR '{title}' = '') " +
                "AND (Book.isbn = '{isbn}' OR '{isbn}' = '') " + 
                "AND (BookCopy.isCheckedOut = 0) " +
                "AND (BookCopy.isOnHold = 0) " +
                "AND (BookCopy.isDamaged = 0) " +
                "AND (Book.isReserved = 1) " +
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
        } else {
            res.status(200);
            res.send(results);
        }
    });
});

router.post('/placeHold', function(req, res, next) {
    var updateQuery = "UPDATE BookCopy SET isOnHold = 1, futureRequester = NULL " +
                "WHERE isbn = '{isbn}' AND copyNumber = {copyNumber} " +
                "AND isOnHold = 0 AND isCheckedOut = 0 " + 
                "AND isDamaged = 0 " +
                "AND '{isbn}' IN " +
                "(SELECT isbn FROM Book WHERE isReserved = 0) " +
                "AND '{username}' IN " +
                "(SELECT username FROM StudentAndFaculty WHERE isDebarred = 0)";
    updateQuery = format(updateQuery, {
        isbn: req.body.isbn,
        copyNumber: req.body.copyNumber
    });
    executeQuery(updateQuery, function(error, results, fields) {
        if(error) {
            console.log("DONE")
            res.status(500);
            error.query = updateQuery;
            res.send(error);
        }else{

            console.log("WORKED-1");
            var insertQuery = "INSERT INTO Issues (username, isbn, copyNumber, " + 
                                "dateOfIssue, returnDate, extensionDate, countOfExtensions) " +
                                "SELECT username, '{isbn}', {copyNumber}, CURDATE(), " + 
                                "DATE_ADD(CURDATE(), INTERVAL 3 DAY), CURDATE(), 0 " +
                                "FROM StudentAndFaculty WHERE username = '{username}' AND isDebarred = 0";
            insertQuery = format(insertQuery, {
                isbn: req.body.isbn,
                copyNumber: req.body.copyNumber,
                username: req.session.username
                // username: req.query.username
            });
            executeQuery(insertQuery, function(error, results, fields){
                if(error) {
                    res.status(500);
                    error.query = insertQuery;
                    res.send(error);  
                }
                res.status(200);
                res.send(results);
                console.log(insertQuery);
            });
       }
    });
});

router.get('/extensionInfo', function(req, res, next) {
   var issuesQuery = "SELECT dateOfIssue, extensionDate, returnDate, " +
                    "CURDATE() AS newExtensionDate, " +
                    "DATE_ADD(CURDATE(),  INTERVAL 14 DAY) AS newReturnDate " +
                    "FROM Issues WHERE issueId = {issueId}";
    issuesQuery = format(issuesQuery, {
        issueId: req.query.issueId
    });
    executeQuery(issuesQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            error.query = issuesQuery;
            res.send(error);  
        } else {
            res.status(200);
            res.send(results);
    }   }
    });
});

router.post('/extension', function(req, res, next) {
    var updateQuery = "UPDATE Issues JOIN BookCopy ON Issues.isbn = BookCopy.isbn " +
                        "JOIN StudentAndFaculty ON Issues.username = StudentAndFaculty.username " +
                        "SET Issues.countOfExtensions = Issues.countOfExtensions + 1, " +
                        "Issues.extensionDate = CURDATE(), Issues.returnDate = DATE_ADD(CURDATE(),  INTERVAL 14 DAY)" +
                        "WHERE Issues.issueId = {issueId} AND Issues.isbn NOT IN " +
                        "(SELECT isbn FROM BookCopy WHERE futureRequester IS NOT NULL) " +
                        "AND ((StudentAndFaculty.isFaculty = 1 AND Issues.countOfExtensions < 5) " +
                        "OR (StudentAndFaculty.isFaculty = 0 AND Issues.countOfExtensions < 2))";
    updateQuery = format(updateQuery, {
        issueId: req.body.issueId,
        username: req.session.username
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

//Future Request Search Book
router.get('/futureRequestSearch', function(req, res, next) {
    var query = "SELECT BookCopy.copyNumber AS copyNumber, " +
                "Issues.ReturnDate AS availableDate " +
                "FROM BookCopy LEFT JOIN Issues ON " +
                "BookCopy.isbn = Issues.isbn AND " + 
                "BookCopy.copyNumber = Issues.copyNumber " +
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
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Future Request Place
router.get('/futureRequestPlace', function(req, res, next) {
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
    var query = "SELECT Book.shelfNumber AS shelfNumber, Shelf.aisleNumber AS aisleNumber, " +
                "Floor.floorNumber AS floorNumber, Book.subjectName AS subjectName " + 
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
        issueId: req.body.issueId
    });
    var isbn;
    var copyNumber;
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            error.query = query;
            res.send(error);  
        } else if (results.length) {
            isbn = results[0].isbn;
            copyNumber = results[0].copyNumber;
                        var updateQuery = "UPDATE BookCopy SET isOnHold =  0, isCheckedOut = 1 " +
                        "WHERE isbn = '{isbn}' AND copyNumber = {copyNumber} ";
            updateQuery = format(updateQuery, {
                isbn: isbn,
                copyNumber: copyNumber
            });
            executeQuery(updateQuery, function(error2, results2, fields){
                if(error2) {
                    res.status(500);
                    error2.query = updateQuery;
                    res.send(error2);  
                } else {
                    var issuesQuery = "UPDATE Issues SET returnDate = DATE_ADD(CURDATE(), INTERVAL 14 DAY) WHERE issueId = {issueId}";
                    issuesQuery = format(issuesQuery, {
                        issueId: req.body.issueId
                    });
                    executeQuery(issuesQuery, function(error3, results3, fields3)  {
                        if(error3) {
                            res.status(500);
                            error3.query = issuesQuery;
                            res.send(error);
                        } else{
                            res.status(200);
                            res.send(results3);
                        }
                    });
                }
            });
        } else {
            res.status(200);
            res.send({message: "Hold has expired"});
        }
    });

});

//return
router.post('/return', function(req, res, next) {
    var issuesQuery = "SELECT Issues.username AS username, " +
                        "Issues.returnDate AS returnDate, Issues.isbn AS isbn " +
                        "Issues.copyNumber AS copyNumber " +
                    "FROM Issues WHERE Issues.issueId = {issueId} " +
                    "ORDER BY returnDate DESC " +
                    "LIMIT 1";
    issuesQuery = format(issuesQuery, {
        issueId: req.body.issueId
    });
    var username;
    var returnDate;
    executeQuery(issuesQuery, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        } else {
            username = results[0].username;
            returnDate = results[0].returnDate;
            isbn = results[0].isbn;
            copyNumber = results[0].copyNumber;
            var penaltyQuery = "UPDATE StudentAndFaculty " +
                            "SET penalty = penalty + DATEDIFF(CURDATE(), '{returnDate}') * 0.5 "
                            "WHERE username = '{username}' " +
                            "AND DATEDIFF(CURDATE(), '{returnDate}') > 0";
            penaltyQuery = format(penaltyQuery, {
                username: username,
                returnDate: returnDate
            });
            executeQuery(penaltyQuery, function(error, results, fields){
                if(error) {
                    res.status(500);
                    res.send(error);  
                } else {
                    var returnQuery = "UPDATE BookCopy SET isDamaged = {isDamaged}, isCheckedOut = 0 " +
                                        "WHERE BookCopy.copyNumber = {copyNumber} " +
                                        "AND BookCopy.isbn = '{isbn}'";
                    returnQuery = format(returnQuery, {
                        isbn: isbn,
                        isDamaged: req.body.isDamaged,
                        copyNumber: copyNumber
                    })
                    executeQuery(returnQuery, function(error, results, fields){
                        if(error) {
                            res.status(500);
                            res.send(error);  
                        }
                        res.status(200);
                        res.send(results);
                    });
                }
            });
        }
    });
});

//penalty
router.post('/penalty', function(req, res, next) {
    var userQuery = "SELECT username FROM Issues "
                    "WHERE isbn = '{isbn}' " +
                    "AND copyNumber = {copyNumber} " +
                    "ORDER BY dateOfIssue DESC " +
                    "LIMIT 1";
    userQuery = format(userQuery, {
        isbn: req.body.isbn,
        copyNumber: req.body.copyNumber
    });
    var username;
    executeQuery(userQuery, function(error, results, fields) {
        if(error) {
            res.status(500);
            res.send(error);
        } else {
            username = res[0].username;
            var changePenaltyQuery = "UPDATE StudentAndFaculty " +
                                "SET penalty = penalty + {penalty} " +
                                "WHERE username = '{username}'";
            changePenaltyQuery = format(changePenaltyQuery, {
                penalty: req.body.penalty,
                username: username
            });
            executeQuery(changePenaltyQuery, function(error, results, fields){
                if(error) {
                    res.status(500);
                    res.send(error);  
                } else {
                    var debarredQuery = "UPDATE StudentAndFaculty " +
                                        "SET isDebarred = 1 " +
                                        "WHERE penalty > 100";
                    executeQuery(debarredQuery, function(error, results, fields){
                        if(error) {
                            res.status(500);
                            res.send(error);  
                        }
                        res.status(200);
                        results.username = username;
                        res.send(results);
                    });
                }
            });
        }
    });
});

//Damaged Books Report
router.get('/damagedBooksReport', function(req, res, next) {
    var query = "SELECT MONTH(Issues.returnDate) as month, " + 
                "Book.subjectName AS subject, COUNT(*) AS count " +
                "FROM Book " +
                    "JOIN BookCopy " +
                    "ON (BookCopy.isbn = Book.isbn) " +
                    "JOIN Issues " +
                    "ON (Issues.copyNumber = BookCopy.copyNumber) " +
                "WHERE MONTH(Issues.returnDate) = {month} " +
                    "AND BookCopy.isDamaged = 1 " +
                    "AND (Book.subjectName = '{subject1}' " +
                    "OR Book.subjectName = '{subject2}' " +
                    "OR Book.subjectName = '{subject3}') " +
                "GROUP BY (subject)";
    query = format(query, {
        month: req.query.month,
        subject1: req.query.subject1,
        subject2: req.query.subject2,
        subject3: req.query.subject3
    });
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            error.query = query;
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Popular Books Report
router.get('/popularBooksReport', function(req, res, next) {
    var query = "(SELECT 1 AS month, Book.title AS title, COUNT(*) AS count " +
                "FROM Book " +
                    "JOIN Issues " +
                    "ON Book.isbn = Issues.isbn " +
                "WHERE MONTH(Issues.dateOfIssue) = 1 " +
                "GROUP BY Book.isbn " +
                "LIMIT 3) " +
                "UNION ALL " + 
                "(SELECT 2 AS month, Book.title AS title, COUNT(*) AS count " +
                "FROM Book " +
                    "JOIN Issues " +
                    "ON Book.isbn = Issues.isbn " +
                "WHERE MONTH(Issues.dateOfIssue)  = 2 " +
                "GROUP BY Book.isbn " +
                "LIMIT 3) " +
                "ORDER BY MONTH ASC, count DESC";
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Frequent User Report
router.get('/frequentUserReport', function(req, res, next) {
    var query = "(SELECT 1 AS month, StudentAndFaculty.firstname, " +
                    "StudentAndFaculty.lastname, COUNT(*) as count " +
                    "FROM StudentAndFaculty JOIN Issues " + 
                        "ON StudentAndFaculty.username = Issues.username " +
                    "WHERE MONTH(Issues.dateOfIssue)  = 1 " +
                    "GROUP BY StudentAndFaculty.username " +
                    "HAVING COUNT(*) >= 10 " +
                    "LIMIT 5) " +
                    "UNION ALL " +
                    "(SELECT 2 AS month, StudentAndFaculty.firstname, " +
                    "StudentAndFaculty.lastname, COUNT(*) as count " +
                    "FROM StudentAndFaculty JOIN Issues " + 
                        "ON StudentAndFaculty.username = Issues.username " +
                    "WHERE MONTH(Issues.dateOfIssue)  = 2 " +
                    "GROUP BY StudentAndFaculty.username " +
                    "HAVING COUNT(*) >= 10 " +
                    "LIMIT 5) " +
                    "ORDER BY MONTH ASC, count DESC";
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

//Popular Subject Report
router.get('/popularSubjectReport', function(req, res, next) {
    var query = "(SELECT 1 AS month, Book.subjectName AS subject, COUNT(*) AS count " +
                "FROM Issues " + 
                    "JOIN Book " +
                    "ON Issues.isbn = Book.isbn " +
                "WHERE MONTH(Issues.dateOfIssue) = 1 " +
                "GROUP BY subject) " +
                // "ORDER BY count DESC " +
                "UNION ALL " +
                "(SELECT 2 AS month, Book.subjectName AS subject, COUNT(*) AS count " +
                "FROM Issues " + 
                    "JOIN Book " +
                    "ON Issues.isbn = Book.isbn " +
                "WHERE MONTH(Issues.dateOfIssue) = 2) " +
                // "GROUP BY subject " +
                "ORDER BY month ASC, count DESC";
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            error.query = query;
            res.send(error);  
        }
        res.status(200);
        res.send(results);
    });
});

router.get('/getCopyNumber', function(req, res, next) {
    var query = "SELECT copyNumber FROM BookCopy WHERE " +
                "isbn = '{isbn}' AND " +
                "isDamaged = 0 AND " +
                "isCheckedOut = 0 AND " +
                "isOnHold = 0 " +
                "LIMIT 1";
    query = format(query, {
        isbn: req.query.isbn
    });
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        } else {
            res.status(200);
            res.send(results);
        }
    });
});

router.get('/isStaff', function(req, res, next) {
    var query = "SELECT * FROM Staff WHERE username = '{username}'";
    query = format(query, {
        username: req.session.username;
    });
    executeQuery(query, function(error, results, fields){
        if(error) {
            res.status(500);
            res.send(error);  
        } else {
            res.status(200);
            var isStaff = results.length
            res.send({isStaff: isStaff});
        }
    });
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
    connection.end();
}
module.exports = router;