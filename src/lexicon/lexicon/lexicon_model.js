(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    const Tag = require('../tag/tag_model');

    let lexiconSchema = new Schema(
        {
            name: String,
            description: String,
            tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            status: {type: String, default: 'active'}
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }

    );

    module.exports = mongoose.model('Lexicon', lexiconSchema);

})();
