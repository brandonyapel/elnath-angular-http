var express = require('express');
var router = express.Router();

var pool = require('../modules/pool');

router.get('/', function (req, res) {
    console.log('in /food get')
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(`SELECT * FROM food;`,
             function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

router.post('/', function (req, res) {
    var newFood = req.body;
    console.log('in /food post');
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(`INSERT INTO food ("name", "deliciousness_rating", "is_hot")
            VALUES ($1, $2, $3);`,
            [ newFood.name, newFood.deliciousness_rating, newFood.is_hot],
            function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});

router.put('/:id', function(req, res){
    var foodToEdit = req.body
    console.log('foodToEdit',foodToEdit);
    //Attempt to connect to database
    pool.connect(function(errorConnectingToDatabase,client,done){
        if(errorConnectingToDatabase){
            //There was an error connecting to database
            console.log('Error connecting to database',errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            //We connected to the database!!!
            //Now, we're going to GET things from the DB
            //second param array blocks Bobby Drop Table
            client.query(`UPDATE food
             SET
              name = $1,
              deliciousness_rating = $2,
              is_hot = $3
              WHERE
              id =$4;`,
            [foodToEdit.name,foodToEdit.deliciousness_rating,foodToEdit.is_hot,req.params.id], function(errorMakingQuery,result){
                done();
                if(errorMakingQuery){
                    //Query failed. Did you test it in Postico? If so
                    //Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.delete('/:id', function(req, res){
    var foodToDelete = req.params.id
    //Attempt to connect to database
    pool.connect(function(errorConnectingToDatabase,client,done){
        if(errorConnectingToDatabase){
            //There was an error connecting to database
            console.log('Error connecting to database',errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            //We connected to the database!!!
            //Now, we're going to GET things from the DB
            //second param array blocks Bobby Drop Table
            client.query(`DELETE FROM food WHERE id=$1;`, [foodToDelete], function(errorMakingQuery,result){
                done();
                if(errorMakingQuery){
                    //Query failed. Did you test it in Postico? If so
                    //Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});
module.exports = router