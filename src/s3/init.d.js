(function(){
    "use strict";

    const _ = require("lodash");
    const Config = require("config");

    const TITAN_GLOBALS = require("../core/titan_global");
    const TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    const MODULE_NAME = "s3";

    class S3Init extends TitanInitBase {

        constructor() {
            super();
        }

        init() {

            Logger.info(`S3 module initialised`);

        }

    }

    module.exports = S3Init;

})();