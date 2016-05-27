(function () {
    'use strict';

    let express = require('express');
    let localAuthController = require('./local/local_auth_controller');
    let router = express.Router();

	router.use((req, res, next) => {
		next();
	});
	
    router.post('/local', localAuthController.authenticate);

    module.exports = router;

})();


