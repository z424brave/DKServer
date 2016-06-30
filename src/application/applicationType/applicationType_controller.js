/**
 * Created by Damian.Kelly on 30/06/2016.
 */
(function () {
    'use strict';

    const path = require("path");

    let TITAN_GLOBALS = require("../../core/titan_global");
    let TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    let Logger  = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    let ApplicationTypeModel = require('./applicationType_model');

    class ApplicationTypeController extends TitanModelController {

        constructor(req, res) {

            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new ApplicationType",
                "PUT /:id"      : "Update an existing ApplicationType",
                "DELETE /:id"   : "Deletes an existing ApplicationType",
                "GET /:id"      : "Get the data for a specific ApplicationType",
                "GET /list"     : "List all the existing ApplicationTypes"
            });

            this.setModel(ApplicationTypeModel);

        }

        /**
         * Create an application type
         */
        createApplicationType() {

            Logger.info(`create application type - ${JSON.stringify(this.body())}`);
            this.setModel(new ApplicationTypeModel(this.body()));
            super.create();

        }

        /**
         * Override the list() method to add the populate clause for application retrieval
         */
        /*        list() {
         Logger.info(`ac : list() - calling model controller listWithPopulate()`);
         let populateObject = {};
         populateObject.path = 'user';
         populateObject.select = 'name';
         super.listWithPopulate(populateObject);
         }*/

    }

    module.exports = ApplicationTypeController;

})();
