(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let tagSchema = new Schema({
        name: String,
        description: String,
        status: {type: String, default: 'active'}
    },
    {
        timestamps : {createdAt: "created", updatedAt: "updated"}
    }        
    );

    module.exports = mongoose.model('Tag', tagSchema);

})();
