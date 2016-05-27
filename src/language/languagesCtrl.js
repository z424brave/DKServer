(function () {
    'use strict';

    const path = require("path");

    const LanguageModel = require('./language_model');
    const TITAN_GLOBALS = require("../core/titan_global");
    const ApiController = require(`${TITAN_GLOBALS.CORE}/controllers/titan_api_controller`);
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);    

    class LanguageController extends ApiController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "GET /list": "List all the existing languages"
            });
        }

        listLanguages() {
            LanguageModel.find().then((data) => this.send(data))
                .catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });            
        }
    }

    module.exports = LanguageController;

})();
