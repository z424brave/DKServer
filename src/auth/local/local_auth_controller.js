(function () {
    'use strict';

    let passport = require('passport');
    let authenticationService = require('../auth_service');

    class LocalAuthController {

        authenticate(req, res, next) {
			console.log('authenticate');
            passport.authenticate('local', function (err, user, info) {
				console.log(`authenticate error : ${err}`);
				console.log(`authenticate user  : ${user}`);
				console.log(`authenticate info  : ${JSON.stringify(info)}`);				
                var error = err || info;
                if (error) {
                    //TODO log error
                    return res.status(401).json(error);
                }
                if (! user) {

                    return res.status(500).json({message: 'Something went wrong, please try again.'});
                }

                var token = authenticationService.signToken(user._id, user.name, user.role);
				console.log(`authenticate token : ${token}`);	
                res.json({token});
            })(req, res, next);
        }

    }

    module.exports = new LocalAuthController();

})();
