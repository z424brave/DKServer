(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let FieldSchema = new Schema({
        name: String,
        type: String,
        default: {
            type: Schema.Types.Mixed,
            default: null
        }
    });
    module.exports = mongoose.model("Fields", FieldSchema);

})();
