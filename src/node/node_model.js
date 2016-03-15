(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let baseModel = require(`${ global.TITAN.COMMON}/base_model`);
    let Schema = require('mongoose').Schema;
    let Language = require('../language/language_model');



    let mediaSchema = new Schema ({
        language: Language.schema,
        content: String,
        created: Date
    });

    mediaSchema.pre('save', function (next) {
        baseModel.preCreate(this, next);
    });

    let contentSchema = new Schema({
        user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        media: [mediaSchema],
        translated: Boolean,
        versionNo: Number,
        versionMessage: String,
        created: Date,
        updated: Date
    });

    contentSchema.pre('save', function (next) {
        baseModel.preCreate(this, next);
    });

    let nodeSchema = new Schema({
        name: String,
        user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        content: [contentSchema],
        tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
        type: {type:mongoose.Schema.Types.ObjectId, ref:'Lexicon'},
        status: {type: String, default: 'active'},
        created: Date,
        updated: Date
    });

    nodeSchema.pre('save', function (next) {
        baseModel.preCreateUpdate(this, next);
    });

    nodeSchema
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
        });

    module.exports = mongoose.model('Node', nodeSchema);

})();