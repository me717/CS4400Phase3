var express = require('express');
var mysql = require('mysql');
var format = require('string-template');

var credentials = require('./credentials');
var router = express.Router();

/* LOGIN. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Database' });
    var query = "SELECT username FROM User WHERE '{username}' = username";
    query = query + " AND '{password}' = password";
    query = format(query ,{
                        username: req.query.username,
                        password: req.query.password
    });
    executeQuery(query, function(error, results, fields){
        if(results.length){
            res.status(200);
            res.send(results);
        } else{
            res.render('index', { title: "Empty"});
        }
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