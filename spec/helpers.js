(function() {
    "use strict";

    let fs = require("fs");
    let path = require("path");

    const ENCODING = "utf8";

    class Helpers {
        static loadJson(from) {
            return JSON.parse(fs.readFileSync(from, ENCODING));
        }

        static randomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        static ROOT() {
            return ""+process.cwd();
        }
        static SPEC() {
            return path.join(Helpers.ROOT(), "spec");
        }
        static MOCK() {
            return path.join(Helpers.SPEC(), "mocks");
        }
    }

    module.exports = Helpers;

})();