// Load Node environment variable configuration file
var validateEnvVariables = require("./config/env.conf.js");
var express = require("express");
var http = require("http");
var mongoose = require("mongoose");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongooseConf = require("./config/mongoose.conf.js");
var routes = require("./app/routes/routes.js");
var helperFunctions = require("./app/helpers/helperFunctions.js");

// Set up appropriate environment variables if necessary
validateEnvVariables();

var app = express();

// Create a Node server for our Express app
var server = http.createServer(app);

// Set the port for this app
var port = process.env.PORT || 5000;

// Pass Mongoose configuration Mongoose instance
mongooseConf(mongoose);

// Populate data if DB is not already populated.
helperFunctions.populateDb();

if (process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test') {
    // Log every request to the console
    app.use(morgan('dev'));
}

// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/dist'));

// Initialize app routes
routes(app);

// Serve video files
app.use('/videos', express.static('videos'));
// Serve client side code
app.use('/', express.static('client'));
app.get('*', function (req, res) {
    res.sendFile('/dist/index.html', {root: __dirname});
});

// Ignition Phase
server.listen(port);

// Expose app
module.exports = app;