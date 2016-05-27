(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    const Tag = require('../tag/tag_model');

    let lexiconSchema = new Schema(
        {
            name: String,
            tags: [Tag.schema],
            status: {type: String, default: 'active'}
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }

    );

    module.exports = mongoose.model('Lexicon', lexiconSchema);

})();
