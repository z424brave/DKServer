(function () {
    "use strict";

    const path = require("path");

    const TITAN_GLOBALS = require("../../core/titan_global");
    
    const ApiController = require(`${TITAN_GLOBALS.CORE}/controllers/titan_api_controller`);
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);
    
    const ChannelModel = require("../model/channels");
    
    class ChannelsController extends ApiController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create and register a new channel",
                "PUT /:id"      : "Update an existing Channel",
                "DELETE /:id"   : "Deletes an existing Channel",
                "GET /:id"      : "Get the channel data for a specific channel",
                "GET /list"     : "List all the existing channels",
                "[*] GET /drivers"  : "List all the drivers that can be used for channels"
            });
        }

        createChannel() {
            let channelModel = new ChannelModel(this.body());
            channelModel.save().then((d) => {
                this.send(d);
            }).catch(function (err) {
                this.serverError();
                Logger.error(err);
            });
        }

        getChannel() {
            ChannelModel.findOne({"_id": this.id()}).then((data) => {
                this.send(data);
            }).catch((err) => {
                this.notFound();
                Logger.error(err);
            });
        }

        updateChannel() {
            ChannelModel.findOneAndUpdate({"_id": this.id()}, this.body())
                .then((data) => this.send(data))
                .catch((err) => {
                    this.notFound();
                    Logger.error(err);
                });
        }

        deleteChannel() {
            ChannelModel.findOneAndRemove({"_id": this.id()}).then((data) => this.send(data))
                .catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });
        }

        listChannels() {
			Logger.info(`In listChannels`);
            ChannelModel.find().then((data) => this.send(data))
                .catch((err) => {
                    this.serverError();
                    Logger.error(err);
                });
        }
        
        listDrivers() {

        }

    }

    module.exports = ChannelsController;

})();
