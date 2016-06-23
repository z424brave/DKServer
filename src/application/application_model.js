/**
 * Created by Damian.Kelly on 23/06/2016.
 */
(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let ApplicationSchema = new Schema(
        {
            name: String,
            applicationType: String,
            nodes: [{type:mongoose.Schema.Types.ObjectId, ref:'Node'}],
            applications: [{type:mongoose.Schema.Types.ObjectId, ref:'Application'}]
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );
    module.exports = mongoose.model("Application", ApplicationSchema);

})();
