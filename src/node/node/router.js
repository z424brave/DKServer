(function () {
    'use strict';

    let express = require("express");
    let controller = require("./node_controller");
    let authService = require("../../auth/auth_service");

    let router = new express();
    let nodeController = new controller();

     router.get('/:id', authService.hasRole('user'), nodeController.get);
     router.get('/user/:userId', authService.hasRole('user'), nodeController.findUserNodes);
     router.post('/', authService.hasRole('user'), nodeController.save);
     router.put('/', authService.hasRole('user'), nodeController.update);
     router.delete('/:id', authService.hasRole('user'), nodeController.delete);

     module.exports = router;

})();