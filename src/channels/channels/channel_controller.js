(function () {
    'use strict';

    const path = require("path");

    const TITAN_GLOBALS = require("../../core/titan_global");

    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);

    const ModelController = require(`${TITAN_GLOBALS.CORE}/controllers/titan_model_controller`);

    let ChannelModel = require('../model/channels');

    class ChannelController extends ModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create and register a new channel",
                "PUT /:id"      : "Update an existing Channel",
                "DELETE /:id"   : "Deletes an existing Channel",
                "GET /:id"      : "Get the channel data for a specific channel",
                "GET /list"     : "List all the existing channels",
                "[*] GET /drivers"  : "List all the drivers that can be used for channels"
            });

            this.setModel(ChannelModel);

        }

        createChannel() {
            this.setModel(new ChannelModel(this.body()));
            this.create();
        }

    }

    module.exports = ChannelController;

})();
