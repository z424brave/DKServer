(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let baseModel = require(`${ global.TITAN.COMMON}/base_model`);
    let Schema = require('mongoose').Schema;
    let Tag = require('../tag/tag_model');

    let lexiconSchema = new Schema({
        name: String,
        tags: [Tag.schema],
        status: {type: String, default: 'active'},
        created: Date,
        updated: Date
    });


    lexiconSchema.pre('save', function (next) {

        baseModel.preCreateUpdate(this, next);

    });


    module.exports = mongoose.model('Lexicon', lexiconSchema);


})();