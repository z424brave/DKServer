(function () {
    'use strict';

    let Node = require('../node_model');
    let _ = require('lodash');

    const TITAN_GLOBALS = require("../../core/titan_global");
    const BaseController = require(`${ TITAN_GLOBALS.CORE}/controllers/base_controller`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON}/logger`);

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
			Logger.info(`Content save start`);
            Logger.info(`${req.params.node_id}`);
            Logger.info(`${req.body}`);
            Logger.info(`Content save end`);
            var nodeId = req.params.node_id;
            var index;
            Node.findById(nodeId)
                .then(super.handleEntityNotFound(res))
                .then(node => {
                    index = node.content.length;
                    node.content.push(req.body);
                    return node.save();
                })
                .then(super.responseWithResult(res))
                .catch(err => next(err));

        }


        /**
         * Update a content item of a node
         */
        update(req, res, next) {
            Logger.info(`Content update start`);
            Logger.info(`${req.params.node_id}`);
            Logger.info(`${req.body}`);
            Logger.info(`Content update end`);
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