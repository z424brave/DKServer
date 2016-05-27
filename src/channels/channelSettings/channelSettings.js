(function() {
    "use strict";

    const express = require("express");

    const ChannelSettings = require("./channelSettingsCtrl");

    let router = new express();


    router.get("/", (req,res) => (new ChannelSettings(req,res)).index());

    module.exports = router;

})();