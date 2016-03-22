(function () {
    'use strict';

    let express = require('express');
    let localAuthController = require('./local/local_auth_controller');
    let router = express.Router();

	router.use((req, res, next) => {
//		let nowTime = new Date();
//		let fTime = `${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}:${nowTime.getMilliseconds()}`;
		console.log(`Time: ${new Date()} - ${req.url} - ${res.statusCode}`);
		next();
	});
	
    router.post('/local', localAuthController.authenticate);

    module.exports = router;

})();


