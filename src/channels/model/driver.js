(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = mongoose.Schema;

    const FieldSchema = require("./field_schema");

    let DriverSchema = new Schema({
            name: String,
            status: {type: String, default: 'active'},
            user: {type:Schema.Types.ObjectId, ref:'User'},
            channelSettings: [FieldSchema],
            channelMetaData: [FieldSchema]
        },
        {
            timestamps: { createdAt: 'created', updatedAt: 'updated' }
        });

    module.exports = mongoose.model("Driver", DriverSchema);

})();
