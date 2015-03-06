'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var UserSchema = require('./user.schema');

var PersonSchema = Schema();
PersonSchema = UserSchema({
    nombre: String,
    apellido: String,
    dni: {
        tipo: String,
        numero: String
    },
    direcciones: [{
        tipo: String,
        numero: Number,
        calle: String,
        entre: {
            x: String,
            y: String
        },
        zip: Number,
        esquina: Boolean,
        telefonos: [{
            tipo: String,
            cn: Number,
            zone: Number,
            phone: Number
        }]
    }],
    telefonos: [{
        tipo: String,
        cn: Number,
        zone: Number,
        phone: Number
    }],
    email: {
        type: String,
        lowercase: true
    }
});

/**
 * Validations
 */

// Validate email is not taken
PersonSchema
    .path('email')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({
            email: value
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');

module.exports = function(add) {
    var schema = PersonSchema;

    if (add) {
        schema.add(add);
    }

    return schema;
}