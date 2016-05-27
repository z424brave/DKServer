(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;
    const TITAN_GLOBALS = require("../../core/titan_global");

    let tagSchema = new Schema({
        name: String
    });

    module.exports = mongoose.model('Tag', tagSchema);

})();
