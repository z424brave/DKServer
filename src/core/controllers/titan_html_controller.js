(function(){
    "use strict";

    let path = require("path");

    let TitanController = require("./titan_controller");

    class TitanHtmlController extends TitanController {

        constructor(req,res) {
            super(req,res);
        }

        send() {

        }

        error(message,code) {

        }

        _name() {
            return this.constructor.name;
        }

        template(name) {
            return path.join(this._name() , name);
        }

    }

    module.exports = TitanHtmlController;

})();