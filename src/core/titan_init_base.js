(function(){
    "use strict";

    require("./titan_global");

    let Eventify = require(`${global.TITAN.COMMON}/eventify`);

    const EVENT_UPDATE_APP = "titan.boot.update.app";
    const EVENT_APP_ON = "titan.boot.event.add";

    class TitanInitBase extends Eventify {

        constructor() {
            super();
        }

        init() {
            throw new Error("Classes that extend TitanInitBase must implement Init");
        }

        isInit() {
            return true;
        }

        app() {

            let send = (cmd) => {
                let args = Array.prototype.slice.call(arguments);
                args.unshift();
                this.trigger(cmd, args);
            };

            return {
                set: (key,value) => send("set", key, value),
                use: (cb) => send("use" , cb),
                on: (event,cb) => this.trigger(EVENT_APP_ON, [event, cb, false]),
                once: (event,cb) => this.trigger(EVENT_APP_ON, [event, cb, true])
            };
        }

    }

    module.exports = TitanInitBase;

})();