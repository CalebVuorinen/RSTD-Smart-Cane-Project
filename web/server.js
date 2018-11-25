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

database.open(() => {
    // Set NODE_ENV to 'development' and uncomment the following if to only run
    // the seeder when in dev mode
    // if (process.env.NODE_ENV === 'development') {
    //  seeder.init();
    // }
    // seeder.init();
});

router.load(app, './src/controllers');

// redirect all others to the index (HTML5 history)
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(3000);

console.log('Express listening on port 3000.');

//Open browser
var opn = require('opn');

opn('http://localhost:3000').then(() => {
    console.log('Browser closed.');
});


