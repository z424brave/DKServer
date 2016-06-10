(function(){
    "use strict";

    let _ = require("lodash");

    let TITAN_GLOBALS = require("../titan_global");
    let TitanConfig = require("../titan_config");
    let TitanView = require("../titan_view");

    let Collection = require(`${TITAN_GLOBALS.COMMON}/collection`);
    let HTTPStatus = require(`${TITAN_GLOBALS.COMMON}/httpErrors`);
    let Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);

    const MIMES = {
        html : "text/html",
        json : "application/json"
    };

    const ERROR_TEMPLATE = "error";

    // new GrahamController(res,req).saveGraham();
    
    class TitanController extends Collection {

        constructor(req, res, options) {
            // Overwrite these to customize your controller
            super();
            this.MODULE_ROOT = __dirname;
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["html" , "json"];
            this._req = req;
            this._res = res;
            this._module = null;

        }

        req() {
            return this._req;
        }

        res() {
            return this._res;
        }

        error(error, message) {
            this.outs(ERROR_TEMPLATE, error, {
                "code" : error,
                "message" : message
            });
        }

        send(template, code) {
            this.outs(template, code);
        }

        notFound(message) {
            this.httpError(404, message);
        }

        bad(message) {
            this.httpError(400, message);
        }

        methodNotAllowed(message) {
            this.httpError(405, message);
        }

        gone(message) {
            this.httpError(410, message);
        }

        serverError() {
            this.httpError(500);
        }

        httpError(code , message) {
            if (!(HTTPStatus[code] || false)) {
                code = 500;
            }

            message = message || HTTPStatus[code];
            this.error(code,message);
        }

        module() {
            if (this._module === null ) {
                if ( this.MODULE_ROOT === null) {
                    Logger.warn(`No module root set, using relative path to controller ${ __dirname }`);
                }

                this._module = new TitanConfig(this.MODULE_ROOT);
                this._module.loadConfig();
            }

            return this._module;
        }

        mountPoint() {
            return this.module().mount;
        }

        outs(template, code, data) {
            Logger.info(`In outs : ${template} - ${code} - ${data}`);
            code = code || 200;
            data = data || {};

            let response = { "default" : () => this.res().status(406).send(HTTPStatus[406]) };
            let payload = _.extend({}, this.data(), data);

            this.res().status(code);

            if(this.isAllowed("html")) {
                let path = code === 200 ? path.join(this.MODULE_ROOT, this.module().find("view.path") || this.MODULE_VIEWS, template) :
                    path.join(TITAN_GLOBALS.VIEWS , template);
                let view = new TitanView(this.module().find("view.engine"));
                response[MIMES.html] = () => this.res().send(view.render(path, payload));
            }

            if(this.isAllowed("json")) {
                response[MIMES.json] = () => this.res().send(payload);
            }

            this.res().format(response);
        }

        isAllowed(responseType) {
            return this.CONTROLLER_ALLOWED_TYPES.lastIndexOf(responseType) !== -1;
        }

    }

    module.exports = TitanController;

})();
