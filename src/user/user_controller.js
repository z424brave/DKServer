(function () {
    'use strict';

    const path = require("path");

    let TITAN_GLOBALS = require("../core/titan_global");

    const TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    let UserModel = require('./user_model');

    class UserController extends TitanModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new User",
                "PUT /:id"      : "Update an existing User",
                "DELETE /:id"   : "Deletes an existing User",
                "GET /:id"      : "Get the data for a specific User",
                "GET /list"     : "List all the existing Users"
            });

            this.setModel(UserModel);

        }

        /**
         * Override list() method of TitanModelController to pass an attribute filter list via .select
         * For users we do NOT want the query to return the salt or the password fields.
         */
        listUsers() {
            this.getModel().find({})
                .select("-salt -password")
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.serverError();
                    Logger.error(err);
                }
            );
        }

        createUser() {
            Logger.info(`In createUser`);
            this.setModel(new UserModel(this.body()));
            this.create();
        }

    }

    module.exports = UserController;

})();
