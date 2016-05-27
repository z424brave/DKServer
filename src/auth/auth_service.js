(function () {
    'use strict';

    let passport = require('passport');
    let jwt = require('jsonwebtoken');
    let expressJwt = require('express-jwt');
    let compose = require('composable-middleware');
    const Config = require("config");

    let TITAN_GLOBALS = require("../core/titan_global");
    let Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);    
    let User = require(`${TITAN_GLOBALS.APP}/user/user_model`);
	
    let validateJwt = expressJwt({
        secret: Config.get("secrets.session.token")
    });

    class AuthenticationService {

        /**
         * Attaches the user object to the request if authenticated
         * Otherwise returns 403
         */
        isAuthenticated() {
            return compose()
            // Validate jwt
                .use((req, res, next) => {
                    validateJwt(req, res, next);
                })
                // Attach user to request
                .use((req, res, next) => {
					Logger.info(`In isAuthenticated - ${JSON.stringify(req.user)}`);					
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
                .use(this.isAuthenticated())
                .use((req, res, next) => {
                    
                    const userRoles = Config.has("roles.user") ? Config.get("roles.user") : [];
                    Logger.info(`config roles : ${userRoles}`);
                    Logger.info(`this user roles : ${req.user.roles}`);
                    Logger.info(`required role : ${roleRequired}`);
                    if (userRoles.indexOf(roleRequired) >= 0 ) {
                        if (req.user.roles.indexOf(roleRequired) >= 0) {
                            next();
                        } else {
                            res.status(403).send('Forbidden');
                        }
                    } else {
                        res.status(403).send('Forbidden');
                    }

                });
        }

        /**
         * Returns a jwt token signed by the app secret
         */

        signToken(id, name, roles) {
			Logger.info(`AuthenticationService / signToken - ${JSON.stringify(name)}`);			
            return jwt.sign({_id: id, name: name, roles: roles}, Config.get("secrets.session.token"), {
                expiresIn: (Config.has("secrets.session.expires") ? Config.get("secrets.session.expires") : "30 days")
            });
        }

    }

    module.exports = new AuthenticationService();

})();
