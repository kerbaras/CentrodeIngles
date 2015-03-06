'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var PersonSchema = require('../../model/person.schema');
var Schema = mongoose.Schema;
var AlumnoSchema = PersonSchema({
    legajo: String,
    matricula: {
        str: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    },
    ausencias: [{
        dia: {
            type: Date,
            default: Date.now
        },
        profesor: {
            type: Schema.Types.ObjectId,
            ref: 'profesor'
        }
    }],
    mesesPagos: [{
        mes: Number,
        ano: Number,
        fecha: {
            type: Date,
            default: Date.now
        },
        factura: {
            type: Schema.Types.ObjectId,
            ref: 'factura'
        }
    }],
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'curso'
    }
});

AlumnoSchema
    .virtual('profile')
    .get(function() {
        return {
            'nombre': this.apellido + ', ' + this.nombre,
            'dni': this.dni,
            'role': this.role,
            'matricula': this.matricula,
            'legajo': this.legajo
        };
    });

// Non-sensitive info we'll be putting in the token
AlumnoSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'dni': this.dni,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate legajo is not taken
AlumnoSchema
    .path('legajo')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({
            legajo: value
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'El legajo especificado esta en uso.');

// Validate matricula is not taken
AlumnoSchema
    .path('matricula.str')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({
            legajo: value
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'El legajo especificado esta en uso.');

module.exports = mongoose.model('Alumno', AlumnoSchema);