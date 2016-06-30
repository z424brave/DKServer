(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;
    let Language = require('../language/language_model');
    
    let mediaSchema = new Schema (
        {
            language: Language.schema ,
            content: String
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    let contentSchema = new Schema(
        {
            user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            media: [mediaSchema],
            translated: Boolean,
            sentForTranslation: Date,
            published: Date,
            versionNo: Number,
            versionMessage: String
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    let nodeSchema = new Schema(
        {
            name: String,
            user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            content: [contentSchema],
            tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            type: String,
            status: {type: String, default: 'active'}
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

/*    nodeSchema
        .virtual('base')
        .get(function () {
            return {
                '_id': this._id,
                'name': this.name,
                'user': this.user,
                'tags': this.tags,
                'type': this.type,
                'status': this.status
            };
        });*/

    module.exports = mongoose.model('Node', nodeSchema);

})();
