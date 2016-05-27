(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let roleSchema = new Schema({
        name: String,
        description: String
    });

    module.exports = mongoose.model('Role', roleSchema);

})();
