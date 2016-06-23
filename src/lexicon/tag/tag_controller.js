(function () {
    'use strict';

    const path = require("path");
    
    let TagModel = require('../tag/tag_model');

    const TITAN_GLOBALS = require("../../core/titan_global");
    
    const TitanModelController = require(`${ TITAN_GLOBALS.CORE}`.concat('/controllers/titan_model_controller'));
    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat('/logger'));

    class TagController extends TitanModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Tag",
                "PUT /:id"      : "Update an existing Tag",
                "DELETE /:id"   : "Deletes an existing Tag",
                "GET /:id"      : "Get the data for a specific Tag",
                "GET /list"     : "List all the existing Tags"
            });

            this.setModel(TagModel);

        }

        createTag() {
            Logger.info(`In createTag`);
            this.setModel(new TagModel(this.body()));
            this.create();
        }
        
    }

    module.exports = TagController;

})();
