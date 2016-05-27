(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = mongoose.Schema;

    let ChannelSchema = new Schema({
        name: String,
        driver: String,
        status: {type: String, default: 'active'},
        user: {type:Schema.Types.ObjectId, ref:'User'},
        config: [
            {type:Schema.Types.ObjectId, ref:'Fields'},
            {value: String}
        ]
	},
	{
		timestamps: { createdAt: 'created', updatedAt: 'updated' }
	});

    module.exports = mongoose.model("Channel", ChannelSchema);

})();
