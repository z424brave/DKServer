(function () {
    'use strict';

    const path = require("path");

    const ModelController = require('../core/controllers/titan_model_controller');
    const Logger = require('../common/logger');

    let UserModel = require('./user_model');

    class UserController extends ModelController {

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

        listUsers() {
            this.getModel().find({}, '-salt -password')
//                .populate('roles', 'name')
                .then(users => {
                    this.send(users);
                }).catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });
        }

        createUser() {
            Logger.info(`In createUser`);
            this.setModel(new UserModel(this.body()));
            this.create();
        }

    }

    module.exports = UserController;

})();
