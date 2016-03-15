(function () {
    'use strict';

    let express = require("express");
    let controller = require("./content_controller");
    let authService = require("../../auth/auth_service");
    let router = new express();
    let contentController = new controller();

    router.get('/:node_id/contents', authService.hasRole('user'), contentController.list);
    router.get('/:node_id/contents/:content_id', authService.hasRole('user'), contentController.get);
    router.post('/:node_id/contents', authService.hasRole('user'), contentController.save);
    router.put('/:node_id/contents', authService.hasRole('user'), contentController.update);

    module.exports = router;

})();