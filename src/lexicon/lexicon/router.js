(function () {
    'use strict';

    let express = require("express");
    let controller = require("./lexicon_controller");
    let authService = require("../../auth/auth_service");

    let router = new express();
    let lexiconController = new controller();

    router.get('/', authService.hasRole('user'), lexiconController.list);
    router.get('/:id', authService.hasRole('user'), lexiconController.get);
    router.post('/', authService.hasRole('admin'), lexiconController.save);
    router.put('/', authService.hasRole('admin'), lexiconController.update);
    router.delete('/:id', authService.hasRole('admin'), lexiconController.delete);


    module.exports = router;

})();