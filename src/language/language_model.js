(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let languageSchema = new Schema({
        name: String,
        iso3166: String
    });

    module.exports = mongoose.model('Language', languageSchema);

})();
