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
        if(results.length) {
            res.status(200);
            res.send(results);
        } else {
            res.render('index', { title: "Empty"});
        }
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
        }
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
        }
    })
});

//Track location
router.get('/trackLocation', function(req, res, next) {
    var query = "SELECT Book.shelfNumber, Shelf.aisleNumber, " +
                "Floor.floorNumber, Book.subject " + 
                "FROM Book " +
                "JOIN Shelf ON Book.shelfNumber = Shelf.shelfNumber " +
                "JOIN Floor ON Shelf.floorNumber = Floor.floorNumber" +
                "WHERE Book.isbn = {isbn}";
    query = format(query, {
        isbn: req.query.isbn
    });
});

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