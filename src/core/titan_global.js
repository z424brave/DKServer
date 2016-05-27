(function(){
    "use strict";

    const path = require("path");

    const ROOT = process.cwd();
    const APP = path.join(ROOT, "src");
    const PATHS = {
        ROOT: ROOT,
        APP: APP,
        SCHEMA: path.join(APP, "schema"),
        COMMON: path.join(APP, "common"),
        CORE: path.join(APP, "core"),
        SETTINGS: path.join(ROOT, "config"),
        VIEWS: path.join(APP, "views")
    };

 //   global.TITAN = PATHS;
    module.exports = PATHS;

})();