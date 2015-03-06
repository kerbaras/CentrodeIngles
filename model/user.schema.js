'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var functs = {
    isEnabled: function(enabled) {
        return enabled;
    },

    isExpired: function(_is, _at) {
        if (_is) {
            return true
        }

        if (_at != null && _at < Date.now) {
            return true;
        }
        return false;
    }
}

var UserSchema = new Schema({
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    salt: String,
    enabled: {
        type: Boolean,
        default: true
    },
    locked: {
        type: Boolean,
        default: false
    },
    expired: {
        is: {
            type: Boolean,
            default: false
        },
        at: {
            type: Date,
            default: null
        }
    },
    credentials: {
        tmp: {
            type: String,
            default: ''
        },
        expired: {
            type: Boolean,
            default: false
        },
        expiredAt: {
            type: Date,
            default: null
        }
    }

});


/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function() {
        return {
            'name': this._id,
            'role': this.role,
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
        return hashedPassword.length;
    }, 'Password cannot be blank');

var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    isEnabled: function() {
        return this.enabled;
    },

    isLocked: function() {
        return this.locked;
    },

    isExpired: function() {
        if (this.expired.is) {
            return true
        }

        if (this.expired.at != null && this.expired.at < Date.now) {
            return true;
        }
        return false;
    },

    credentialsAreExpired: function() {
        if (this.expired.is) {
            return true
        }

        if (this.expired.at != null && this.expired.at < Date.now) {
            return true;
        }
        return false;
    },

    isAvailable: function() {
        if (!functs.isEnabled(this.enabled)){
          return false;
        }
        if (!functs.isEnabled(this.locked)){
          return false;
        }
        if (functs.isExpired(this.expired.is, this.expired.at)){
          return false;
        }
        return true;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

module.exports = function(add) {
    var schema = UserSchema;
    if (add) {
        schema.add(add);
    }
    return schema;
};