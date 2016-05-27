(function(){
    "use strict";

    const TITAN_GLOBALS = require("../titan_global");

    let TitanApiController = require("./titan_api_controller");

    let Logger = require("../../common/logger");
    let dataModel = null;
    class TitanModelController extends TitanApiController {

        /**
         * Initializes the module by calling the constructor of its parent class - TitanApiController.
         * @param req {httpRequest}
         * @param res {httpResponse}
         */
        constructor(req,res) {

            super(req,res);
            this.dataModel = null;

        }

        /**
         * Sets the model on which the other methods act.
         *
         * @param modelEntity {mongoose.model} The model to be used for all methods in the class
         */
        setModel(modelEntity) {
            this.dataModel = modelEntity;
        }

        /**
         * Returns the model.
         *
         * @returns {mongoose.model} The mongoose model to be acted on.
         */
        getModel() {
            return this.dataModel;
        }

        /**
         * Retrieves a single instance of the model using the _id value and sends the JSON back as a response.
         */
        get() {
            Logger.info(`In get ${this.getModel().modelName} for ${this.id()}`);
            this.getModel().findOne({"_id": this.id()})
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.notFound();
                    Logger.error(err);
                }
            );
        }

        handleParamValue(queryParamValue, complexProperty) {

            let splitParameter = ',';
            let paramValue;

            if (queryParamValue.indexOf(splitParameter) > -1) {
                let arrayTypeParameter = [];
                let arrayValues = queryParamValue.split(splitParameter);
                arrayValues.forEach((arrayValue) => {
                    if (arrayValue) {
                        arrayTypeParameter.push(arrayValue);
                    }
                });
                paramValue = {};
                paramValue.$in = arrayTypeParameter;

            } else {

                if (complexProperty) {
                    paramValue = {};
                    paramValue.$eq = queryParamValue;
                } else {
                    paramValue = queryParamValue;
                }

            }

            return paramValue;
        }

        convertSearch(queryParams) {

            let searchQuery = {};

            for (var property in queryParams) {
                if (queryParams.hasOwnProperty(property)) {

                    Logger.info(`${property} : ${queryParams[property]}`);

                    searchQuery[property] = this.handleParamValue(queryParams[property], (property.indexOf('.') > -1));
                }
            }

            return searchQuery;

        }

        /**
         * Retrieves all the instances of the model satisfying the search criteria passed in the request
         * and sends the JSON data back as a response.
         */
        list() {
            let queryObject = this.convertSearch(this.req().query);
            Logger.info(`In list ${this.getModel().modelName}`);
            Logger.info(`Query Parameters : ${JSON.stringify(this.req().query)}`);
            Logger.info(`Query Object is : ${JSON.stringify(queryObject)}`);
//            this.getModel().find(queryObject)
            this.getModel().find(this.req().query)
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.serverError();
                    Logger.error(err);
                }
            );
        }

        /**
         * Creates a new instance from the data passed in the request and sends the result back as JSON
         * data in the response.
         */
        create() {
            Logger.info(`In create ${this.getModel().constructor.modelName}`);
            this.getModel().save()
                .then((data) => {
                    this.send(data);
                })
                .catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });
        }

        /**
         * Updates a specific instance identified via the _id passed in the request and using the data passed
         * in the request and sends the result back as JSON data in the response.
         */
        update() {
            Logger.info(`In update ${this.getModel().modelName} for ${this.id()}`);
            this.getModel().findOneAndUpdate({"_id": this.body()._id}, this.body())
                .then((data) => {
                    this.send(data);
                })
                .catch((err) => {
                    this.notFound();
                    Logger.error(err);
                });
        }

        /**
         * Deletes a specific instance identified via the _id passed in the request and sends the result back
         * as JSON data in the response.
         */
        deleteInstance() {
            Logger.info(`In delete ${this.getModel().modelName} for ${this.id()}`);
            this.getModel().findOneAndRemove({"_id": this.id()})
                .then((data) => {
                    this.send(data);
                })
                .catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });
        }

    }

    module.exports = TitanModelController;

})();
