(function () {
    'use strict';

    const express = require("express");
    const Controller = require("./language_controller");

    let authService = require("../auth/auth_service");
    let router = new express();

    router.get('/', (req,res) => (new Controller(req,res)).index());
    router.get('/list', authService.hasRole('user'), (req, res) => (new Controller(req, res)).listLanguages());

    module.exports = router;

})();
