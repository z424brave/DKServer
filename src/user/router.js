(function () {
    'use strict';

    let express = require("express");
    let userController = require("./user_controller");
    let authService = require("../auth/auth_service");
    let router = new express();

    //load users for the searchform select box forces the role to be user.
    //TOOD create extra endpoint that only returns names and id's
    router.get('/', authService.hasRole('user'), userController.list);
    router.get('/:id', authService.hasRole('admin'), userController.get);
    router.post('/', authService.hasRole('admin'), userController.save);
    router.put('/', authService.hasRole('admin'), userController.update);
    router.delete('/:id', authService.hasRole('admin'), userController.delete);

    module.exports = router;

})();