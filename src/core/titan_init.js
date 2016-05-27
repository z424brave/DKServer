(function(){
    "use strict";

	const TITAN_GLOBALS = require("./titan_global");

    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);
    const Eventify = require(`${ TITAN_GLOBALS.COMMON }/eventify`);


    class TitanInit extends Eventify {
        constructor (inits) {
            super();
            if ( !(inits || false) ) {
                throw new Error("No initializers where passed");
            }

            this._inits = inits;

        }

        init() {
            this._inits.forEach((initFile) => {

                Logger.info(`Initializing ${initFile}`);

                let InitKlass = require(initFile);
                let init = new InitKlass();

                if ( typeof(init.isInit) === "function" && init.isInit()) {
                    this.bond(init);
                    init.init();
                } else {
                    throw new Error(`${initFile} is not an initializer`);
                }

            });
        }
    }

    module.exports = TitanInit;

})();