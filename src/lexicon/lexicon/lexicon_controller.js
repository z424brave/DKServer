(function () {
    'use strict';

    let Lexicon = require('./lexicon_model');
    let _ = require('lodash');
    let BaseController = require(`${ global.TITAN.CORE}/controllers/base_controller`);


    class LexiconController extends BaseController {

        constructor() {
            super();
        }


        get(req, res, next) {
            return super.get(Lexicon, req, res, next);
        }

        save(req, res, next) {
            return super.save(Lexicon, req, res, next);
        }

        list(req, res, next) {
            Lexicon.find({status: 'active'})
                //todo return virtual without tags?
                .then(types => {
                    res.status(200).json(types);
                })
                .catch(super.handleError(res));
        }


        /**
         * Update a lexicon
         */
        update(req, res, next) {
            var lexicon = req.body;
            Lexicon.findByIdAndUpdate(
                lexicon._id, {
                    $set: {
                        name: lexicon.name
                    }
                })
                .then(entity => res.status(200).json('ok'))
                .catch(err => next(err));
        }

        /**
         * Delete a lexicon
         */
        delete(req, res, next){
            var lexiconId = req.params.id;
                Lexicon.findByIdAndUpdate(
                    lexiconId , {
                        $set: {
                            status: 'deleted'
                        }
                    })
                    .then(entity => res.status(200).json('ok'))
                    .catch(err => next(err));
            }


    }

    module.exports = LexiconController;
})();