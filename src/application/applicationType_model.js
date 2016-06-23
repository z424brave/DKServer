/**
 * Created by Damian.Kelly on 23/06/2016.
 */
(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let ApplicationTypeSchema = new Schema(
        {
            name: String,
            tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            nodes: [{
                nodeName: String,
                nodeType: String,
                required: Boolean,
                tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}]
            }],
            applications: [{
                applicationType: String,
                minOccurs: Number,
                maxOccurs: Number
            }]
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );
    module.exports = mongoose.model("ApplicationType", ApplicationTypeSchema);

})();
