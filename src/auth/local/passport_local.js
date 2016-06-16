(function () {
    'use strict';

    let passport = require('passport');
    let LocalStrategy = require('passport-local');

    let TITAN_GLOBALS = require("../../core/titan_global");
    let Logger = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    class PassportLocal {

        localAuthenticate(User, email, password, done) {
			Logger.info(`localAuthenticate : ${email}`);
            User.findOne({
                    email: email.toLowerCase()
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'This email is not registered.'
                        });
                    }
                    if (user.status !== 'active') {
                        return done(null, false, {
                            message: 'This email has been disabled.'
                        });
                    }
                    user.authenticate(password, (authError, authenticated) => {
						Logger.info(`localAuthenticate : authenticate : ${authenticated}`);
                        if (authError) {
                            Logger.info(`localAuthenticate : authenticate error : ${authError}`);
                            return done(authError);
                        }
                        if (! authenticated) {
                            Logger.info(`localAuthenticate : authenticated : ${authenticated}`);                            
                            return done(null, false, {message: 'This password is not correct.'});
                        } else {
                            Logger.info(`localAuthenticate : authenticated : ${authenticated}`);
                            User.findByIdAndUpdate(
                                user._id, {
                                    $set: {
                                        lastLogin: new Date()
                                    }
                                }
                            ).then(loggedInUser => {
                                return done(null, loggedInUser);
                            });
                        }
                    });
                })
                .catch(err => done(err));
        }

        setup(User) {
            var passportLocal = this;
            passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password' // this is the virtual field on the model
            }, (email, password, done) => {
                return passportLocal.localAuthenticate(User, email, password, done);
            }));

        }
    }

    module.exports = new PassportLocal();
    
})();
