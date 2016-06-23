(function () {
    'use strict';

    const path = require("path");

    const TITAN_GLOBALS = require("../../core/titan_global");

    const TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));

    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    let LexiconModel = require('./lexicon_model');

    class LexiconController extends TitanModelController {

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
            this.create();
        }

        /**
         * Override the list() method to add the populate clause for node retrieval
         */
        list() {
            Logger.info(`Lexicon Controller : list() - calling model controller listWithPopulate()`);
            let populateObject = {};
            populateObject.path = 'tags';
            populateObject.select = 'name description';
            super.listWithPopulate(populateObject);
        }
    }

    module.exports = LexiconController;

})();
