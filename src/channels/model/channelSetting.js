(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let ChannelSettingsSchema = new Schema({
        node: {type: Schema.Types.ObjectId, "ref" : "Channel"},
        channel: Schema.Types.ObjectId,
        value: {}
    });

    module.exports = mongoose.model("ChannelSetting", ChannelSettingsSchema);

})();