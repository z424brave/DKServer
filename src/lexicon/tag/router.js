(function () {
    'use strict';

    let express = require("express");
    let controller = require("./tag_controller");
    let authService = require("../../auth/auth_service");

    let router = new express();
    let tagController = new controller();

    router.get('/:lexiconId/tags/',  authService.hasRole('user'), tagController.list);
    router.get('/:lexiconId/tags/:id', authService.hasRole('user'), tagController.get);
    router.post('/:lexiconId/tags/', authService.hasRole('admin'), tagController.save);
    router.put('/:lexiconId/tags/', authService.hasRole('admin'), tagController.update);
    router.delete('/:lexiconId/tags/:id', authService.hasRole('admin'), tagController.delete);

    module.exports = router;

})();