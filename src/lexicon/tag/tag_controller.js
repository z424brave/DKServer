(function () {
    'use strict';

    let Lexicon = require('../lexicon/lexicon_model');
    let Tag = require('./tag_model');	
    let _ = require('lodash');
    let BaseController = require(`${ global.TITAN.CORE}/controllers/base_controller`);

    class TagController extends BaseController {

        constructor() {
            super();
        }

        get(req, res, next) {
        }

        save(req, res, next) {
            var lexiconId = req.params.lexiconId;
            var tag = req.body;
            Lexicon.findById(lexiconId)
                .then(super.handleEntityNotFound(res))
                .then(lexicon => {
                    lexicon.tags.push(tag);
                    lexicon.save(function (err) {
                        if (err) {
                            console.log('error adding tag', err);
                            next(err);
                        }
                        else res.status(200).json('ok');
                    });
                })
                .catch(err => next(err));

        }

        list(req, res, next) {
            var lexiconId = req.params.lexiconId;
            Lexicon.findById(lexiconId)
                .then(super.handleEntityNotFound(res))
                .then(entity => res.json(entity.tags))
                .catch(err => next(err));
        }

        listAll(req, res, next) {
			console.log(`in listAll in tagcontroller`);
            Tag.find()
                .then(super.handleEntityNotFound(res))
                .then(entity => res.json(entity))
                .catch(err => next(err));
        }
				
        update(req, res, next) {
            var lexiconId = req.params.lexiconId;
            var tag = req.body;
            Lexicon.findById(lexiconId)
                .then(super.handleEntityNotFound(res))
                .then(lexicon => {
                    lexicon.tags.id(tag._id).name = tag.name;
                    lexicon.save(function (err) {
                        if (err) {
                            console.log('error updating tag', err);
                            next(err);
                        }
                        else res.status(200).json('ok');
                    });
                })
                .catch(err => next(err));
        }

        delete(req, res, next) {
            var lexiconId = req.params.lexiconId;
            var tagId = req.params.id;
            Lexicon.findById(lexiconId)
                .then(super.handleEntityNotFound(res))
                .then(lexicon => {
                    lexicon.tags.id(tagId).remove();
                    lexicon.save(function (err) {
                        if (err) {
                            console.log('error deleting tag', err);
                            next(err);
                        }
                        else res.status(200).json('ok');
                    });
                })
                .catch(err => next(err));
        }
    }

    module.exports = TagController;
})();