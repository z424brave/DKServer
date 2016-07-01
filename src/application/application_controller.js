/**
 * Created by Damian.Kelly on 30/06/2016.
 */
(function () {
    'use strict';

    const path = require("path");

    let TITAN_GLOBALS = require("../core/titan_global");
    let TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    let Logger  = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    let ApplicationModel = require('./application_model');

    class ApplicationController extends TitanModelController {

        constructor(req, res) {

            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Application",
                "PUT /:id"      : "Update an existing Application",
                "DELETE /:id"   : "Deletes an existing Application",
                "GET /:id"      : "Get the data for a specific Application",
                "GET /list"     : "List all the existing Applications"
            });

            this.setModel(ApplicationModel);

        }

        /**
         * Create an application
         */
        createApplication() {

            Logger.info(`create application - ${JSON.stringify(this.body())}`);
            this.setModel(new ApplicationModel(this.body()));
            super.create();

        }

        /**
         * Override the list() method to add the populate clause for application retrieval
         */
        list() {
            Logger.info(`ac : list() - calling model controller listWithPopulate()`);
            let populateObject = {};
            populateObject.path = 'applicationType';
            populateObject.select = 'name';
            super.listWithPopulate(populateObject);
        }

        get() {
            Logger.info(`In get ${this.getModel().modelName} for ${this.id()}`);
            this.getModel().findOne({"_id": this.id()})
                .populate('applicationType', 'name')
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.notFound();
                    Logger.error(err);
                }
            );
        }
    }

    module.exports = ApplicationController;

})();
