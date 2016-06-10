(function () {
    'use strict';

    const path = require("path");

    let NODE_GLOBALS = require("../node_global");
    let TitanModelController = require(`${NODE_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    let Logger  = require(`${NODE_GLOBALS.COMMON}`.concat("/logger"));
    let Logger2 = require(`${NODE_GLOBALS.COMMON}/logger`);

    let TITAN_GLOBALS = require("../../core/titan_global");
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
            Logger.info(`TITAN - ${JSON.stringify(TITAN_GLOBALS)}`);
            Logger.info(`NODE  - ${JSON.stringify(NODE_GLOBALS)}`);

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
/*            let node = this.body();
            let tagIds = [];

            for(var tag of node.tags){
                tagIds.push(tag._id);
            }

            node.tags = tagIds;
            node.status = 'active';*/

            this.setModel(new NodeModel(this.body()));
			super.create();

        }

        /**
         * Override the list() method to add the populate clause for node retrieval
         */
        list() {
            Logger.info(`nc : list() - calling model controller list()`);
            super.list();
        }

/*        list() {
            let queryObject = this.convertSearch(this.req().query);
            Logger.info(`nc : In list ${this.getModel().modelName}`);
            Logger.info(`nc : Query Parameters : ${JSON.stringify(this.req().query)}`);
            Logger.info(`nc : Query Object     : ${JSON.stringify(queryObject)}`);
            this.getModel().find(queryObject)
//                .populate('user', 'name')
                .populate('fred')
                .then((data) => {
                    Logger.info(`nc : Node Data : ${JSON.stringify(data)}`);
                    this.send(data);
                }).catch((err) => {
                    this.serverError();
                    Logger.error(err);
                }
            );
        }*/

        findUserNodes() {
            let userId = this.req().params.userId;
            Logger.info(`in findUserNodes - ${userId}`);
            NodeModel.find({user: userId, status: 'active'})
                .populate('user', 'name')
//                .populate('type', 'name')
                .exec( (err, result) => {
                    if (err) {
                        this.serverError();
                        Logger.error(err);
                    }
                    this.send(result);
                });

        }

        deleteNode() {

            Node.findByIdAndUpdate(
                this.id(), {
                    $set: {
                        status: 'deleted'
                    }
                })
                .then(super.handleEntityNotFound(res))
                .then(entity => res.status(204).json())
                .catch(err => next(err));
        }

    }

    module.exports = NodeController;

})();
