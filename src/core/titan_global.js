(function(){
    "use strict";

    let path = require("path");
    let config = require('../../config');
    let rootDir = config.rootDir;

    if(!rootDir) {
        rootDir = process.cwd();
    }

    const ROOT = path.join(rootDir, "src");

    console.log('root: ' + ROOT);

    global.TITAN = {
        ROOT: ROOT,
        SCHEMA: path.join(ROOT, "schema"),
        COMMON: path.join(ROOT, "common"),
        CORE: path.join(ROOT, "core"),
        SETTINGS: path.join(ROOT, "settings"),
        VIEWS: path.join(ROOT, "views")
    };

    module.exports = {
        ROOT: ROOT,
        SCHEMA: path.join(ROOT, "schema"),
        COMMON: path.join(ROOT, "common"),
        CORE: path.join(ROOT, "core"),
        SETTINGS: path.join(ROOT, "settings"),
        VIEWS: path.join(ROOT, "views")
    };

})();