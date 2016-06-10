(function(){
    "use strict";

    let _ = require("lodash");

    let TitanController = require("./titan_controller");
    let Logger = require("../../common/logger");

    const TYPE = "json";

    class TitanApiController extends TitanController {
        constructor(req,res) {
            super(req,res);
            this._readme = null;
            this._noReadme = false;
            this._body = null;

            return this;
        }

        body() {
            if (this._body === null) {
                _.each(this.req().body, (value, key) => {
                    this._body = this._body || {};
                    try {
                        this._body[key] = JSON.parse(value);
                    } catch(err) {
                        this._body[key] = value;
                    }
                });
            }

            return this._body;
        }

        id() {
            if((!this.id || false)) {
                this.bad("id is required");
            }
            return this.req().params.id;
        }

        send(object) {
            if ((!object||false)) {
                this.notFound();
                Logger.error("Object was empty");
            } else {
                this.res().type(TYPE).send(object);
            }

        }

        error(code, message) {
            this.res().type(TYPE).status(code).send({
                "code"  : code,
                "error" : message
            });
        }
        
        setReadme(data) {
            let _this = this;
            this._readme = this._readme || {
                    "Base Url" : _this.mountPoint(),
                    "[*]" : " = Not yet implemented",
                    "GET /" : "Returns this help for the end point"
                };

            if ( data || false ) {
                if (typeof(data) === "object" && !Array.isArray(data)) {
                    _.extend(this._readme, data);
                } else {
                    throw new Error(`Readme Data must be an Object by ${ typeof(data) } found!`);
                }
            }

            return this._readme;
        }

        noReadme() {
            this._noReadme = true;
        }

        readme() {
            this._noReadme = false;
        }

        index() {
            if(!this._noReadme) {
                this.send(this.setReadme());
            } else {
                this.notFound();
            }
        }
    }

    module.exports = TitanApiController;

})();