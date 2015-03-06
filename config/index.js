'use strict';

var path = require('path');

module.exports = {

  root: path.normalize(__dirname + '/..'),
  
  port: 3000,

  mongo: {
    uri: 'mongodb://localhost/ci-dev',
    options: {
      db: {
        safe: true
      }
    }
  }
}