(function(){
    "use strict";

    const Path = require("path");

    const TITAN_GLOBALS = require("../core/titan_global");
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);
    const Collection = require(`${TITAN_GLOBALS.COMMON}/collection`);
    const Schema = require(`${TITAN_GLOBALS.COMMON}/schema`);

    const DEFAULT_SCHEMA = "channel_ctrl";

    class ChannelCtrl extends Collection {

        constructor(schema) {
            super();

            this.schema = schema || Path.join(TITAN_GLOBALS.SCHEMA, DEFAULT_SCHEMA);
        }

        name(value) {
            return this.setify('_name' , value);
        }

        connection(value) {
            return this.setify('_connection' , value);
        }

        setify(key,value) {
            if(!this.has(key)) {
                this.field(key);
            }

            if(value || false ) {
                this[key] = value;
            }

            return this.find(key);
        }

    }

})();