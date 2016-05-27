(function() {
    "use strict";

    const path = require("path");

    const Global = require("../../core/titan_global");
    const ApiController = require(`${Global.CORE}/controllers/titan_api_controller`);
    const Logger = require(`${Global.COMMON}/logger`);

    class ChannelsSettingsController extends ApiController {

        constructor(req,res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST / "           : "Create a new set of channel settings",
                "PUT /:id"          : "Update existing settings",
                "DELETE /:id"       : "Delete existing settings",
                "GET /:id"          : "Get a specific settings",
                "GET /list"         : "Get all the settings",
                "GET /node/:id"     : "Get all the settings for a node",
                "GET /channel/:id"  : "Get all the settings for a channel"
            });
        }

    }

    module.exports = ChannelsSettingsController;

})();