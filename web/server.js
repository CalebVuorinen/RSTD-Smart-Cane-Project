"use strict";
var express     = require('express'),
    bodyParser  = require('body-parser'),
    fs          = require('fs'),
    router      = require('./src/routes/router'),
    database    = require('./src/lib/database'),
    seeder      = require('./src/lib/dbSeeder'),
    app         = express(),
    customers   = JSON.parse(fs.readFileSync('data/customers.json', 'utf-8')),
    states      = JSON.parse(fs.readFileSync('data/states.json', 'utf-8'));

    var mongodb = require("mongodb");
    var ObjectID = mongodb.ObjectID;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//The dist folder has our static resources (index.html, css, images)
app.use(express.static(__dirname + '/dist'));

if (process.platform === "win32") {
    require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    }).on("SIGINT", () => {
        console.log('SIGINT: Closing MongoDB connection');
        database.close();
    });
}

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
// Connect to the database before starting the application server.

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  // mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test,localhost:27018,localhost:27019?replicaSet=mongo-repl", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  // const collection = db.collection("customers");
  // const changeStream = collection.watch();
  // // start listen to changes
  // changeStream.on("change", function(change) {
  //   console.log('change----------------------------------------------------------------------------');
  //   console.log(change);
  // });

});

database.open(() => {
    // Set NODE_ENV to 'development' and uncomment the following if to only run
    // the seeder when in dev mode
    // if (process.env.NODE_ENV === 'development') {
    //  seeder.init();
    // }
    seeder.init();
});

router.load(app, './src/controllers');

// redirect all others to the index (HTML5 history)
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(8000);

console.log('Express listening on port 8000.');



