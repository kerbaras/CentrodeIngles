/**
 * Express configuration
 */

'use strict';

var express = require('express');
var config = require('./');

module.exports = function(app) {
    app.set('appPath', config.root + '/public');
};