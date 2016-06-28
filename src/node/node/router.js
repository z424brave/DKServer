(function () {
    'use strict';

    let express = require("express");
    let Controller = require("./node_controller");
    let authService = require("../../auth/auth_service");

    let multer  = require('multer');

    let storage = multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    // TODO : refactor multer
    let upLoadFile = multer({ storage: storage }).single('file') ;
    let router = new express();

    router.get('/', (req,res) => (new Controller(req,res)).index());
    router.get('/api/list', (req, res) => (new Controller(req, res)).list());
    router.get('/list', authService.hasRole('user'), (req, res) => (new Controller(req, res)).list());
    router.get('/:id', authService.hasRole('user'), (req,res) => (new Controller(req,res)).get());
    router.get('/user/:userId', authService.hasRole('user'), (req, res) => (new Controller(req,res)).findUserNodes());
    router.post('/', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).createNode());
    router.post('/api/', authService.hasRole('user'), upLoadFile, (req,res) => (new Controller(req,res)).storeNode());
    router.delete('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).delete());
    router.put('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).update());
    router.put('/publish/:id', (req,res) => (new Controller(req,res)).publishNode());

    module.exports = router;

})();
