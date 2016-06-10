(function () {
    'use strict';

    let express = require("express");

    let Controller = require("./s3_controller");
    let authService = require("../auth/auth_service");
    let router = new express();

	router.get('/', authService.hasRole('user'), (req, res) => (new Controller(req, res)).list());
//    router.get('/', authService.hasRole('user'), s3Controller.list);
//    router.get('/:id', authService.hasRole('admin'), s3Controller.get);
//    router.post('/', authService.hasRole('admin'), s3Controller.save);
    router.put('/', authService.hasRole('admin'), (req, res) => (new Controller(req, res)).update());
//    router.delete('/:id', authService.hasRole('admin'), s3Controller.delete);

    module.exports = router;

})();
