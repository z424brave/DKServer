(function () {
    'use strict';

    let crypto = require('crypto');
    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let PasswordGenerator = require('./password_generator');
    let Schema = require('mongoose').Schema;

    const TITAN_GLOBALS = require('../core/titan_global');
    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat('/logger'));

    let userSchema = new Schema(
        {
            name: String,
            email: {
                type: String,
                lowercase: true
            },
            roles: [
              {type: String, default: 'user'}
//              {type:mongoose.Schema.Types.ObjectId, ref:'Role'}
            ],
            password: String,
		    lastLogin: Date,
            status: {type: String, default: 'active'},
            salt: String
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    /**
     * Virtuals
     */
// Public profile information
    userSchema
        .virtual('profile')
        .get(function () {
            return {
                '_id': this._id,
                'name': this.name,
                'email': this.email,
                'roles': this.roles,
                'status': this.status,
	            'lastLogin': this.lastLogin			
            };
        });

// Non-sensitive info we'll be putting in the token
    userSchema
        .virtual('token')
        .get(() => {
            Logger.info(`In virtual token - ${this.roles}`);
            return {
                '_id': this._id,
                'roles': this.roles
            };
        });

    /**
     * Validations
     */
// Validate empty email
    userSchema
        .path('email')
        .validate(function (email) {
            return email.length;
        }, 'Email cannot be blank');

// Validate empty password
    userSchema
        .path('password')
        .validate(function (password) {
            return password.length;
        }, 'Password cannot be blank');

// Validate email is not taken
    userSchema
        .path('email')
        .validate(function (value, respond) {
            var self = this;
            return this.constructor.findOne({email: value})
                .then(function (user) {
                    if (user) {
                        if (self.id === user.id) {
                            return respond(true);
                        }
                        return respond(false);
                    }
                    return respond(true);
                })
                .catch(function (err) {
                    throw err;
                });
        }, 'The specified email address is already in use.');

    var validatePresenceOf = function (value) {
        return value && value.length;
    };

    /**
     * Pre-save hook
     */
    userSchema
        .pre('save', function (next) {

            Logger.info(`pre save password - ${this.password}`);
						
			if(this.password === undefined) {
				this.password = PasswordGenerator.generatePassword();
			}

            Logger.info(`pre save password - ${this.password}`);
			
            if (!validatePresenceOf(this.email)) {
                next(new Error('Email is required'));
            }


            if (!validatePresenceOf(this.name)) {
                next(new Error('Name is required'));
            }


            // Make salt with a callback
            this.makeSalt((saltErr, salt) => {
                if (saltErr) {
                    next(saltErr);
                }
                this.salt = salt;
                this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
                    if (encryptErr) {
                        next(encryptErr);
                    }
                    this.password = hashedPassword;
                    Logger.info(`before save 2 - ${this.password}`);
                    next();
                });
            });
        });

    /**
     * Methods
     */
    userSchema.methods = {
        /**
         * Authenticate - check if the passwords are the same
         *
         * @param {String} password
         * @param {Function} callback
         * @return {Boolean}
         * @api public
         */
        authenticate(password, callback) {
            Logger.info(`In User authenticate - ${password}`);
            if (!callback) {
				Logger.info("User authenticate - no callback");
                return this.password === this.encryptPassword(password);
            }

            this.encryptPassword(password, (err, pwdGen) => {
                if (err) {
                    return callback(err);
                }
                Logger.info(`User authenticate - in callback - ${password} / ${pwdGen}`);
                if (this.password === pwdGen) {
                    Logger.info(`User authenticated login - ${this._id} : ${this.email} : ${this.lastLogin}`);
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            });
        },

        /**
         * Make salt
         *
         * @param {Number} byteSize Optional salt byte size, default to 16
         * @param {Function} callback
         * @return {String}
         * @api public
         */
        makeSalt(byteSize, callback) {
            var defaultByteSize = 16;

            if (typeof arguments[0] === 'function') {
                callback = arguments[0];
                byteSize = defaultByteSize;
            } else if (typeof arguments[1] === 'function') {
                callback = arguments[1];
            }

            if (!byteSize) {
                byteSize = defaultByteSize;
            }

            if (!callback) {
                return crypto.randomBytes(byteSize).toString('base64');
            }

            return crypto.randomBytes(byteSize, (err, salt) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, salt.toString('base64'));
                }
            });
        },

        /**
         * Encrypt password
         *
         * @param {String} password
         * @param {Function} callback
         * @return {String}
         * @api public
         */
        encryptPassword(password, callback) {
			Logger.info(`User encryptPassword - ${password}`);
            if (!password || !this.salt) {
                return null;
            }

            var defaultIterations = 10000;
            var defaultKeyLength = 64;
            var salt = new Buffer(this.salt, 'base64');

            if (!callback) {
                return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                    .toString('base64');
            }

            return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, key.toString('base64'));
                }
            });
        }
    };

    module.exports = mongoose.model('User', userSchema);

})();
