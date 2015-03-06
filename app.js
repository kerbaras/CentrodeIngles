/**
 * Main application file
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var app = express();

require('./config/express')(app);
require('./routes')(app);

var server = app.listen(config.port, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});