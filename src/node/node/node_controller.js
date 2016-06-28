(function () {
    'use strict';

    const path = require("path");

    let TITAN_GLOBALS = require("../../core/titan_global");
    let TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    let Logger  = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));
    let s3Controller = require("../../s3/s3_controller");

    let NodeModel = require('../node_model');

    class NodeController extends TitanModelController {

        constructor(req, res) {
            
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Node",
                "PUT /:id"      : "Update an existing Node",
                "DELETE /:id"   : "Deletes an existing Node",
                "GET /:id"      : "Get the data for a specific Node",
                "GET /list"     : "List all the existing Nodes"
            });

            this.setModel(NodeModel);

        }

        storeNode() {

            Logger.info(`store node - ${JSON.stringify(this.req().file)}`);
            
            let uploadResponse = {};
            uploadResponse.status = 'ok';
            uploadResponse.filename = this.req().file.originalname;
            this.send(uploadResponse);
        }
        /**
         * Create a node
         */
        createNode() {

            Logger.info(`create node - ${JSON.stringify(this.body())}`);
            this.setModel(new NodeModel(this.body()));
			super.create();

        }

        /**
         * Override the list() method to add the populate clause for node retrieval
         */
        list() {
            Logger.info(`nc : list() - calling model controller listWithPopulate()`);
            let populateObject = {};
            populateObject.path = 'user';
            populateObject.select = 'name';
            super.listWithPopulate(populateObject);
        }

        findUserNodes() {
            let userId = this.req().params.userId;
            Logger.info(`in findUserNodes - ${userId}`);
            NodeModel.find({user: userId, status: 'active'})
                .populate('user', 'name')
                .exec( (err, result) => {
                    if (err) {
                        this.serverError();
                        Logger.error(err);
                    }
                    this.send(result);
                });

        }
        
        /**
         * Create a node
         */
        publishNode() {
            let nodeId = this.id();
            Logger.info(`publish node - ${nodeId}`);
            Logger.info(`publish node - ${JSON.stringify(this.body())}`);
            let s3Control = new s3Controller(this.req(), this.res());
            s3Control.createPublishFile();
            super.update();

        }
        
    }

    module.exports = NodeController;

})();
