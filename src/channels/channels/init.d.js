(function(){
    "use strict";

    const TITAN_GLOBALS = require("../../core/titan_global");
    const TitanInitBase = require(`${TITAN_GLOBALS.CORE}/titan_init_base`);
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);
    const Modules = require(`${TITAN_GLOBALS.CORE}/titan_modules`);

    class ChannelsInit extends TitanInitBase {

        constructor() {
            super();
        }

        init() {
            Logger.info("Starting Channels");
        }
    }

    module.exports = ChannelsInit;

})();