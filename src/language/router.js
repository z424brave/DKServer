(function () {
    'use strict';

    let express = require("express");
    let languageController = require("./language_controller");
    let authService = require("../auth/auth_service");
    let router = new express();

    router.get('/', authService.hasRole('user'), languageController.list);

    module.exports = router;

})();