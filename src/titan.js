(function () {
    "use strict";

    const EVENT_TITAN_BOOT_CONFIG_LOADED = "titan.boot.config.loaded";
    const EVENT_TITAN_BOOT_ROUTER_ATTACHED = "titan.boot.router.attached";
    const EVENT_TITAN_BOOT_UPDATE_APP = "titan.boot.update.app";
    const EVENT_TITAN_BOOT_ADMIN_ROUTER_ATTACHED = "titan.boot.admin.router.attached";
    const EVENT_TITAN_BOOT_API_ROUTER_ATTACHED = "titan.boot.api.router.attached";
    const EVENT_TITAN_BOOT_SERVER_STARTED = "titan.boot.server.started";
    const EVENT_TITAN_BOOT_ADD_EVENT = "titan.boot.event.add";

    const DEFAULT_ADMIN_PREFIX = "/admin";
    const DEFAULT_API_PREFIX = "/api";
    const DEFAULT_ASSET_PREFIX = "/assets";
    const DEFAULT_TITAN_ASSETS = "/titan";

    let express = require("express");
    let cors = require("cors");
    let chalk = require("chalk");
    let path = require("path");
    let mongoose = require('mongoose');
    let config = require('../config');
    let bodyParser = require('body-parser');
    let winston = require('winston');
    let expressWinston = require('express-winston');

    require(`./core/titan_global`);

    let Eventify = require(`${ global.TITAN.COMMON }/eventify`);
    let TitanModules = require(`${ global.TITAN.CORE }/titan_modules`);
    let TitanInit = require(`${ global.TITAN.CORE }/titan_init`);

    class Titan extends Eventify {

        constructor(port) {
            super();

            this._port = port;
            this._titanConfig = null;
            this._app = null;
            this._admin = null;
            this._api = null;
            this._server = null;
            this._static = null;

            this._routesAttached = false;
            this._initRun = false;
            this._staticFilesAttached = false;

        }

        app() {
            if (null === this._app) {
                this._app = express();
                this._app.use(cors());
                this._app.use(bodyParser.urlencoded({
                    extended: true
                }));
                this._app.use(bodyParser.json());
                this.env = this._app.get('env');
                console.log(`application starting in ${this.env}`);				
                this._app.use(expressWinston.logger({
                    transports: [
                        new winston.transports.Console({
                            json: true,
                            colorize: true
                        })
                    ]
                    //meta: true, // optional: control whether you want to log the meta data about the request (default to true)
                    //msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
                    //expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
                    //colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
                    //ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
                }));
                expressWinston.requestWhitelist.push('body');
				expressWinston.responseWhitelist.push('headers');
            }

            return this._app;
        }

        admin() {
            if (this._admin === null) {
                this._admin = express();
                this._admin.use(cors());
                this._app.use(bodyParser.urlencoded({
                    extended: true
                }));
                this._app.use(bodyParser.json());
            }

            return this._admin;
        }

        api() {
            if (this._api === null) {
                this._api = express();
                this._api.use(cors());
                this._app.use(bodyParser.urlencoded({
                    extended: true
                }));
                this._app.use(bodyParser.json());
            }

            return this._api;
        }

        staticApp() {
            if (this._static === null) {
                this._static = express();
                this._static.use(cors());
            }

            return this._static;
        }

        config() {
            if (this._titanConfig === null) {
                this._titanConfig = new TitanModules(global.TITAN.ROOT, global.TITAN.ROOT);
                this.trigger(EVENT_TITAN_BOOT_CONFIG_LOADED, [this._titanConfig]);
            }

            return this._titanConfig;
        }

        staticFiles() {
            if (!this._staticFilesAttached) {

                // Add the main titan asset store
                this.staticApp().use(DEFAULT_TITAN_ASSETS, express.static(
                    path.join(global.TITAN.ROOT, this.config().application().find("static"))
                ));

                // Add all the module asset stores
                this.config().staticPaths().forEach((route) => {
                    this.staticApp().use(route.mount, express.static(route.path));
                });

                // Mount the static app paths
                this.app().use(DEFAULT_ASSET_PREFIX, this.staticApp());
            }
        }

        server() {
            console.log('server starting');
            if (this._server === null) {
                this.init();
                this.attachRoutes();
                this.staticFiles();

                // Connect to MongoDB
                mongoose.connect(config.mongo.uri, config.mongo.options);
                mongoose.connection.on('error', function (err) {
                    console.error('MongoDB connection error: ' + err);
                    process.exit(-1);
                });
				console.log(`server connected to mongo : ${config.mongo.uri}`);				
                if (config.seedDB) {
					console.log(`seeding mongo`);	
                    require('../config/seed');
                }


                this._server = this.app().listen(this._port, () => {
                    let host = this._server.address().address;
                    let port = this._server.address().port;
                    console.log(`server started - port is ${port}`);
                    //this.trigger(EVENT_TITAN_BOOT_SERVER_STARTED , [host, port]);
                });
            }

            return this._server;
        }

        attachRoutes() {
            if (!this._routesAttached) {
                this.config().routers().forEach((route) => 
					{
					console.log(`adding route : ${JSON.stringify(route)}`);
						this.app().use(route.mount, require(route.router));
					}
				);
                this.trigger(EVENT_TITAN_BOOT_ROUTER_ATTACHED, [this.config().routers()]);

                this.config().admin().forEach((route) => this.admin().use(route.mount, require(route.router)));
                this.trigger(EVENT_TITAN_BOOT_ADMIN_ROUTER_ATTACHED, [this.config().admin()]);

                this.config().api().forEach((route) => this.api().use(route.mount, require(route.router)));
                this.trigger(EVENT_TITAN_BOOT_API_ROUTER_ATTACHED, [this.config().api()]);

                let adminPath = this.config().application().has("admin_prefix") ?
                    this.config().application().find("admin_prefix") : DEFAULT_ADMIN_PREFIX;

                let apiPath = this.config().application().has("api_prefix") ?
                    this.config().application().find("api_prefix") : DEFAULT_API_PREFIX;

                this.app().use(adminPath, this.admin());
                this.app().use(apiPath, this.api());
            }
        }

        init() {
            if (!this._initRun) {
                let titanInit = new TitanInit(this.config().inits());

                titanInit.on(EVENT_TITAN_BOOT_UPDATE_APP, (cmd, args) => {
                    this.app()[cmd].apply(this.app(), args);
                });

                titanInit.on(EVENT_TITAN_BOOT_ADD_EVENT, (event, handler, type) => {
                    this[(type === "once" ? "once" : "on")](event, handler);
                });
                titanInit.init();

                this._initRun = true;
            }
        }

    }

    module.exports = Titan;

})();
