(function () {
    'use strict';

    const path = require("path");

//    const TITAN_GLOBALS = require("../../core/titan_global");

//    const ModelController = require(`${TITAN_GLOBALS.CORE}/controllers/titan_model_controller`);
    const ModelController = require("../../core/controllers/titan_model_controller");

    const Logger = require("../../common/logger");

    let LexiconModel = require('./lexicon_model');

    class LexiconController extends ModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Lexicon",
                "PUT /:id"      : "Update an existing Lexicon",
                "DELETE /:id"   : "Deletes an existing Lexicon",
                "GET /:id"      : "Get the data for a specific lexicon",
                "GET /list"     : "List all the existing Lexicons"
            });

            this.setModel(LexiconModel);

        }

        createLexicon() {
            Logger.info(`In createLexicon`);
            this.setModel(new LexiconModel(this.body()));
            let hasStatus = this.getModel().schema.paths.status ? this.getModel().schema.paths.status.path : "No status";
            Logger.info(`Lexicon has status : ${JSON.stringify(hasStatus)}`);
            this.create();
        }

    }

    module.exports = LexiconController;

})();
