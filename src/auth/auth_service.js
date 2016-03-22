(function () {
    'use strict';

    let passport = require('passport');
    let config = require('../../config');
    let jwt = require('jsonwebtoken');
    let expressJwt = require('express-jwt');
    let compose = require('composable-middleware');
    let User = require('../user/user_model');

    let validateJwt = expressJwt({
        secret: config.secrets.session
    });


    class AuthenticationService {

        /**
         * Attaches the user object to the request if authenticated
         * Otherwise returns 403
         */
        isAuthenticated() {
            return compose()
            // Validate jwt
                .use(function (req, res, next) {
                    validateJwt(req, res, next);
                })
                // Attach user to request
                .use(function (req, res, next) {
                    User.findById(req.user._id)
                        .then(user => {
                            if (! user) {
                                return res.status(401).end();
                            }
                            req.user = user;
                            next();
                        })
                        .catch(err => next(err));
                });
        }

		isAuthenticatedNoSec() {
            return compose()
            // Validate jwt
                .use(function (req, res, next) {
                   validateJwt(req, res, next);
                })
                // Attach user to request
                .use(function (req, res, next) {
					console.log(`In isAuthenticatedNoSec - ${req.user}`);
                    User.findById(req.user._id)
                        .then(user => {
                            if (! user) {
                                return res.status(401).end();
                            }
                            req.user = user;
                            next();
                        })
                        .catch(err => next(err));
                });
        }
        /**
         * Checks if the user role meets the minimum requirements of the route
         */

        hasRole(roleRequired) {
            if (! roleRequired) {
                throw new Error('Required role needs to be set');
            }

            return compose()
//                .use(this.isAuthenticated())
                .use(this.isAuthenticatedNoSec())				
                .use(function meetsRequirements(req, res, next) {
                    if (config.userRoles.indexOf(req.user.role) >=
                        config.userRoles.indexOf(roleRequired)) {
                        next();
                    } else {
                        res.status(403).send('Forbidden');
                    }
                });
        }

        /**
         * Returns a jwt token signed by the app secret
         */

        signToken(id, name, role) {
            return jwt.sign({_id: id, name: name, role: role}, config.secrets.session, {
                expiresIn: '30 days'
            });
        }


    }

    module.exports = new AuthenticationService();


})();