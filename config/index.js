(function () {
    "use strict";

    var _ = require('lodash');

    var baseConfig = {


        // Should we populate the DB with sample data?
        seedDB: false,

        // Secret for session, you will want to change this and make it an environment variable
        secrets: {
            session: 'temp-secret'
        },

        userRoles: ["user", "admin"],

        // MongoDB connection options
        mongo: {
            options: {
                db: {
                    safe: true
                }
            }
        }
    };
	var thisConfig = require('./' + (process.env.NODE_ENV || 'development') + '.json');
	var resultConfig = _.merge(baseConfig, thisConfig); 
	console.log(`Config is ${JSON.stringify(resultConfig)}`);
    module.exports = _.merge(
        baseConfig,
        require('./' + (process.env.NODE_ENV || 'development') + '.json'));

})();