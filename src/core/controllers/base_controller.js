(function () {
    'use strict';

    let _ = require('lodash');
    let base;

    const Logger = require("../../common/logger");

    class BaseController {


        constructor() {
            base = this;
        }


        handleError(res, statusCode) {
            return function (err) {
                var message;
                if(err.name === 'ValidationError'){
                    statusCode = 422;
                    message = '';
                    Logger.error(err.stack);
                }
                else {
                    message = 'Server error';
                    statusCode = 500;
                    Logger.error(err);
                }
                res.status(statusCode).send(message);
            };
        }

        respondWith(res, statusCode) {
            statusCode = statusCode || 200;
            return function () {
                res.status(statusCode).end();
            };
        }

        responseWithResult(res, virtual, statusCode) {
            statusCode = statusCode || 200;
            return function (entity) {
                if (entity) {
                    var result;
                    if(virtual){
                        result = entity[virtual];
                    } else {
                       result = entity;
                    }
                    res.status(statusCode).json(result);
                }
            };
        }

        handleEntityNotFound(res) {
            return function (entity) {
                if (! entity) {
                    res.status(404);
                    throw new Error('Entity not found');
                }
                return entity;
            };
        }

        /**
         * Get a single entity
         */
        get(Model, req, res, next) {
            var id = req.params.id;

            Model.findById(id)
                .then(base.handleEntityNotFound(res))
                .then(entity => {
                    res.json(entity);
                })
                .catch(err => next(err));
        }


        /**
         * Save an entity
         */
        save(Model, req, res, next, virtual) {
            var model = new Model(req.body);
            model.save()
                .then(base.responseWithResult(res, virtual))
                .catch(base.handleError(res));

        }

    }

    module.exports = BaseController;

})();