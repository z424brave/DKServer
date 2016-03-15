(function () {
    'use strict';

    let Node = require('../node_model');
    let _ = require('lodash');
    let BaseController = require(`${ global.TITAN.CORE}/controllers/base_controller`);


    class ContentController extends BaseController {

        constructor() {
            super();
        }

        /**
         *
         * Get the list of content from a node
         */
        list(req, res, next) {
            var nodeId = req.params.node_id;
            Node.findById(nodeId)
                .then(super.handleEntityNotFound(res))
                .then(node => {
                    var result = node.content;
                    res.json(result);
                })
                .catch(err => next(err));
        }

        /**
         * Get a single content item
         */
        get(req, res, next) {
            var nodeId = req.params.node_id;
            var contentId = req.params.content_id;
            Node.findById(nodeId)
                .then(super.handleEntityNotFound(res))
                .then(node => {
                    var result = node.content.id(contentId);
                    res.json(result);
                })
                .catch(err => next(err));
        }


        /**
         * Create a content item for a node
         */
        save(req, res, next) {
			console.log(`Content save start`);
			console.log(`${req.params.node_id}`);			
			console.log(`${req.body}`);			
			console.log(`Content save end`);			
            var nodeId = req.params.node_id;
            var index;
            Node.findById(nodeId)
                .then(super.handleEntityNotFound(res))
                .then(node => {
                    index = node.content.length;
                    node.content.push(req.body);
                    return node.save();
                })
//               .then(model =>  {
//					console.log(`in save - ${model}`);
//					model = model[0].content[index];
//				})
                .then(super.responseWithResult(res))
                .catch(err => next(err));

        }


        /**
         * Update a content item of a node
         */
        update(req, res, next) {
			console.log(`Content update start`);
			console.log(`${req.params.node_id}`);			
			console.log(`${req.body}`);			
			console.log(`Content update end`);			
            var nodeId = req.params.node_id;
            var content = req.body;
            //todo use update method
            Node.findById(nodeId)
                .then(super.handleEntityNotFound(res))
                .then(node => {
                    var update = node.content.id(content._id);
                    update.media = content.media;
                    update.translated = content.translated;
                    update.updated = new Date();
                    return node.save();
                })
                .then(model => model = model[0].content.id(content._id))
                .then(super.responseWithResult(res))
                .catch(err => next(err));
        }

    }

    module.exports = ContentController;


})();