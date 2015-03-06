/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /alumnos              ->  index
 * POST    /alumnos              ->  create
 * GET     /alumnos/:id          ->  show
 * PUT     /alumnos/:id          ->  update
 * DELETE  /alumnos/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Alumno = require('./alumnos.model');

// Get list of alumnos
exports.index = function(req, res) {
    Alumno.find({}, '-salt -hashedPassword', function(err, alumnos) {
        if (err) return res.send(500, err);
        res.status(200).json(alumnos);
    });
};

// Get a single alumno
exports.show = function(req, res) {
  Alumno.findById(req.params.id, '-salt -hashedPassword', function (err, alumno) {
    if(err) { return handleError(res, err); }
    if(!alumno) { return res.status(404); }
    return res.status(200).json(alumno);
  });
};

// Creates a new Alumno in the DB.
exports.create = function(req, res) {
  Alumno.create(req.body, function(err, alumno) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(alumno);
  });
};

// Updates an existing alumno in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Alumno.findById(req.params.id, function (err, alumno) {
    if (err) { return handleError(res, err); }
    if(!alumno) { return res.send(404); }
    var updated = _.merge(alumno, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(alumno);
    });
  });
};

// Deletes a alumno from the DB.
exports.destroy = function(req, res) {
  Alumno.findById(req.params.id, function (err, alumno) {
    if(err) { return handleError(res, err); }
    if(!alumno) { return res.status(404); }
    alumno.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}