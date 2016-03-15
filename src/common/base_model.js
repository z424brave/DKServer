(function () {
    'use strict';


    /**
     * Shared methods for mongoose model hooks and validation
     */
    class BaseModel {

        constructor() {

        }

        preCreate(model, next) {

            if (model.created === undefined) {
                model.created = new Date();
            }
            next();
        }


        preCreateUpdate(model, next) {

            if (model.created === undefined) {
                model.created = new Date();
            } else {
                model.updated = new Date();
            }
            next();
        }

    }

    module.exports = new BaseModel();
})();