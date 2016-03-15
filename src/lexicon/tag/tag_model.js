(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let baseModel = require(`${ global.TITAN.COMMON}/base_model`);
    let Schema = require('mongoose').Schema;

    let tagSchema = new Schema({
        name: String
    });

    tagSchema.pre('save', function (next) {
        baseModel.preCreateUpdate(this, next);
    });


    module.exports = mongoose.model('Tag', tagSchema);


})();