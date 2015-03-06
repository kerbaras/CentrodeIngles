'use strict';

var express = require('express');
var controller = require('./alumnos.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.index);
router.delete('/:id', controller.index);

module.exports = router;