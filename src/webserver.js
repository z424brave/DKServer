(function(){
    "use strict";

    const DEFAULT_PORT = 3001;

    let Titan = require("./titan");
    let titan = new Titan(process.env.PORT || DEFAULT_PORT);

    titan.server();

})();
