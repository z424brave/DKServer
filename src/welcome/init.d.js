(function(){
    "use strict";

    let fs = require("fs");
    let path = require("path");
    let chalk = require("chalk");

    let TITAN_GLOBALS = require("../core/titan_global");

    let TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);
    let Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    const ENCODING = "utf8";

    class WelcomeInit extends TitanInitBase {

        constructor() {
            super();
        }

        init() {
            try {
                let welcomeMessage = fs.readFileSync(`${ __dirname }/welcome.txt` , ENCODING);
                console.log(chalk.bold.red(welcomeMessage));
                Logger.info(`NODE environment is : ${process.env.NODE_ENV || "dev"}`);
            } catch(err) {
                console.log(chalk.green("Creative Assembly - Node JS"));
                Logger.warn(chalk.yellow(err));
            }

            this.app().once("titan.boot.server.started" , (host,port) => this.stat(host,port));

        }

        stat(host,port) {
            Logger.info(`Server listening on http://${host === "::" ? "localhost" : host}:${ port }`);
            //console.log(chalk.bold.red(`Server listening on http://${host === "::" ? "localhost" : host}:${ port }`));
        }

    }

    module.exports = WelcomeInit;

})();