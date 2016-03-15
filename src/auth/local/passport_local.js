(function () {
    'use strict';

    let passport = require('passport');
    let LocalStrategy = require('passport-local');

    class PassportLocal {

        localAuthenticate(User, email, password, done) {
			console.log(`localAuthenticate : ${email}`);
            User.findOne({
                    email: email.toLowerCase()
                })
                .then(user => {
                    if (! user) {
                        return done(null, false, {
                            message: 'This email is not registered.'
                        });
                    }
                    user.authenticate(password, function (authError, authenticated) {
						console.log(`localAuthenticate : authenticate : ${authenticated}`);						
                        if (authError) {
                            return done(authError);
                        }
                        if (! authenticated) {
                            return done(null, false, {message: 'This password is not correct.'});
                        } else {
                            return done(null, user);
                        }
                    });
                })
                .catch(err => done(err));
        }

        setup(User, config) {
            var passportLocal = this;
            passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password' // this is the virtual field on the model
            }, function (email, password, done) {
                return passportLocal.localAuthenticate(User, email, password, done);
            }));

        }
    }

    module.exports = new PassportLocal();
})();
