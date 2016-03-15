(function(){
    "use strict";

    require("./titan_global");
    let Eventify = require(`${ global.TITAN.COMMON }/eventify`);

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