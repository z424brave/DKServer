(function () {
    'use strict';

    const path = require("path");

    const ModelController = require("../../core/controllers/titan_model_controller");
    const Logger = require("../../common/Logger");

    let NodeModel = require('../node_model');

    class NodeController extends ModelController {

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
/*            let node = this.body();
            let tagIds = [];

            for(var tag of node.tags){
                tagIds.push(tag._id);
            }

            node.tags = tagIds;
            node.status = 'active';*/

            this.setModel(new NodeModel(this.body()));
			this.create();			

        }

        list() {
            let queryObject = this.convertSearch(this.req().query);
            Logger.info(`nc : In list ${this.getModel().modelName}`);
            Logger.info(`nc : Query Parameters : ${JSON.stringify(this.req().query)}`);
            Logger.info(`nc : Query Object is : ${JSON.stringify(queryObject)}`);
//            this.getModel().find(queryObject)
            this.getModel().find(this.req().query)
                .populate('user', 'name')
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.serverError();
                    Logger.error(err);
                }
            );
        }

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
