/**
 * Created by Damian.Kelly on 31/05/2016.
 */
(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = mongoose.Schema;

    let QueueSchema = new Schema({
            node: {type:Schema.Types.ObjectId, ref:'Node'},
            channel: {type:Schema.Types.ObjectId, ref:'Channel'},
            channel_config: [
                {type:Schema.Types.ObjectId, ref:'Fields'},
                {value: String}
            ],
            status: {type: String, default: 'active'},
            user: {type:Schema.Types.ObjectId, ref:'User'},
            time_to_go: Date,
            time_sent: Date
        },
        {
            timestamps: { createdAt: 'created', updatedAt: 'updated' }
        });

    module.exports = mongoose.model("Queue", QueueSchema);

})();
