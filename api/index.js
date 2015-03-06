'use strict';

var express = require('express');

var router = express.Router();

router.use('/alumnos', require('./alumnos'));

module.exports = router;