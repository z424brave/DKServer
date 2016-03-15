(function () {
    "use strict";

    let config = require('../../config');
    let passportLocal = require('./local/passport_local');
    let User = require('../user/user_model');
    let TITAN_GLOBALS = require("../core/titan_global");
    let Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);
    let chalk = require("chalk");
    let TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);


    class AuthInit extends TitanInitBase {

        constructor() {
            super();
        }

        init() {
            try {
                Logger.info(`start setup passport strategies`);
                passportLocal.setup(User, config);
                Logger.info(`local passport strategy added`);
            } catch (err) {
                //TODO Abort?
				Logger.warn(chalk.yellow("Oh no"));
                Logger.warn(chalk.yellow(err));

            }
        }

    }

    module.exports = AuthInit;

})();