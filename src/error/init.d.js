(function(){
    "use strict";

    let TITAN_GLOBALS = require("../core/titan_global");

    let TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);
    let Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    class ErrorInit extends TitanInitBase {

        constructor () {
            super();
        }

        init() {
            this.trigger("titan.boot.update.app" , ["use" , [function(err, req, res, next) {
                Logger.error(err);
                next(err);
            }]]);
            Logger.info("Error Management Connect");
        }
    }

    module.exports = ErrorInit;

})();