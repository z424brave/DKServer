(function() {
    "use strict";

    const express = require("express");

    const Controller = require("./channel_controller");

    let router = new express();

    router.get('/', (req,res) => (new Controller(req,res)).index());
    router.post('/', (req,res) => (new Controller(req,res)).createChannel());
    router.get('/list' , (req, res) => (new Controller(req,res)).list());
    router.get('/:id', (req,res) => (new Controller(req,res)).get());
    router.put('/:id', (req,res) => (new Controller(req,res)).update());
    router.delete('/:id', (req,res) => (new Controller(req,res)).deleteInstance());

    module.exports = router;

})();
