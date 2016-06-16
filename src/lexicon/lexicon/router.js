(function () {
    'use strict';

    let express = require("express");
    let Controller = require("./lexicon_controller");
    let authService = require("../../auth/auth_service");

    let router = new express();

    router.get('/', (req,res) => (new Controller(req,res)).index());
    router.get('/list', authService.hasRole('user'), (req, res) => (new Controller(req, res)).list());
    router.get('/api/list', (req, res) => (new Controller(req, res)).list());
    router.get('/:id', authService.hasRole('user'), (req,res) => (new Controller(req,res)).get());
    router.get('/api/:id', (req, res) => (new Controller(req, res)).get());
    router.post('/', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).createLexicon());
    router.put('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).update());
    router.delete('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).delete());

    module.exports = router;

})();
