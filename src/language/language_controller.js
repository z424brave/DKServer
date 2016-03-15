(function () {
    'use strict';

    let Language = require('./language_model');
    let BaseController = require(`${ global.TITAN.CORE}/controllers/base_controller`);

    class LanguageController extends BaseController {

        constructor() {
            super();
        }


        list(req, res) {
            Language.find({})
                .then(languages => {
                    res.status(200).json(languages);
                })
                .catch(super.handleError(res));
        }
    }

    module.exports = new LanguageController();


})();

