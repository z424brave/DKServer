(function(){
    "use strict";

    let _ = require("lodash");
    let TitanController = require("./titan_controller");

    const TYPE = "json";

    class TitanApiController extends TitanController {
        constructor(req,res) {
            super(req,res);
            this._readme = null;
            this._noReadme = false;
        }

        send(object) {
            this.res().type(TYPE).send(object);
        }

        error(message,code) {
            this.res().type(TYPE).status(code).send({"error" : message});
        }

        setReadme(data) {
            this._readme = this._readme || {"Index" : "Returns this help for the end point"};
            if (typeof(data) === "object" && !Array.isArray(data)) {
                _.extend(this._readme , data);
            } else {
                throw new Error(`Readme Data must be an Object by ${ typeof(data) } found!`);
            }
        }

        noReadme() {
            this._noReadme = true;
        }

        readme() {
            this._noReadme = false;
        }

        index() {
            if(!this._noReadme) {
                this.send(this._readme);
            } else {
                this.notFound();
            }
        }
    }

    module.exports = TitanApiController;

})();