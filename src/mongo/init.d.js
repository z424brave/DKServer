(function(){
    "use strict";

    const mongoose = require("mongoose");
    const _ = require("lodash");
    const Config = require("config");

    const TITAN_GLOBALS = require("../core/titan_global");
    const TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    const MODULE_NAME = "mongo";
    const PROTO = "mongodb";
    const TEMPLATE_URL = "<%= PROTO %>://<%= HOST %>/<%= DB %>";
    const DEFAULT_HOST = "localhost";

    const C_MODULE = "DB.module";
    const C_HOST = "DB.host";
    const C_DB = "DB.db";
    const C_OPTIONS = "DB.options";
    const C_SEED = "DB.seed";

    class MongoInit extends TitanInitBase {

        constructor() {
            super();
        }

        init() {
            if(Config.has(C_MODULE) && Config.get(C_MODULE) === MODULE_NAME) {
                const hostname = Config.has(C_HOST) ? Config.get(C_HOST) : DEFAULT_HOST;
                const db = Config.has(C_DB) ? Config.get(C_DB) : null;
                const opts = Config.has(C_OPTIONS) ? Config.get(C_OPTIONS) : {};

                if(!hostname || !db) {
                    throw new Error("Database and Hostname are required");
                }

                mongoose.connect(this._url(hostname, db), opts);
                mongoose.connection.on("error" , (err) => {
                    throw new Error(err);
                });

                Logger.info(`Connected to Mongo at ${this._url(hostname, db)}`);

                this._grow();

            } else {
                throw new Error("Mongo module can't be used");
            }
        }

        _url(host, db) {
            const template = _.template(TEMPLATE_URL);
            return template({
                PROTO: PROTO,
                HOST: host,
                DB: db
            });
        }

        _grow() {
            if(Config.has(C_SEED) && Config.get(C_SEED) === true) {
                Logger.info("Planting Database");
                Logger.todo("move seeds to modules, rewrite seed system [WTC-20]");
                require(`${TITAN_GLOBALS.SETTINGS}/seed`);
            }
        }

    }

    module.exports = MongoInit;

})();