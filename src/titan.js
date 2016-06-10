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
    let bodyParser = require('body-parser');
    const Config = require("config");

    const TITAN_GLOBALS = require(`./core/titan_global`);

    let Eventify = require(`${ TITAN_GLOBALS.COMMON }/eventify`);
    let TitanModules = require(`${ TITAN_GLOBALS.CORE }/titan_modules`);
    let TitanInit = require(`${ TITAN_GLOBALS.CORE }/titan_init`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON}/logger`);

    //TODO - externalise whitelist to config

    const whitelist = Config.CORS.whitelist;

    var corsOptions = {
        origin: (origin, callback) => {
            let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
        },
        credentials: true
    };

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
                Logger.info(`CORS Enabled - Whitelist is ${whitelist}`);
                this._app.use(cors(corsOptions));
                this._app.use(bodyParser.urlencoded({
                    extended: true
                }));
                this._app.use(bodyParser.json());
                this.env = this._app.get('env');
				this._app.use(this.logHTTP);
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
                this._titanConfig = new TitanModules(TITAN_GLOBALS.APP, TITAN_GLOBALS.APP);
                this.trigger(EVENT_TITAN_BOOT_CONFIG_LOADED, [this._titanConfig]);
            }

            return this._titanConfig;
        }

        staticFiles() {
            if (!this._staticFilesAttached) {

                // Add the main titan asset store
                this.staticApp().use(DEFAULT_TITAN_ASSETS, express.static(
                    path.join(TITAN_GLOBALS.ROOT, this.config().application().find("static"))
                ));

                // Add all the module asset stores
                this.config().staticPaths().forEach((route) => {
                    this.staticApp().use(route.mount, express.static(route.path));
                });

                // Mount the static app paths
                this.app().use(DEFAULT_ASSET_PREFIX, this.staticApp());
            }
        }

		logHTTP(req, res, next) {
			// very basic logging of http requests
			Logger.info(`HTTP : ${req.method} - ${res.statusCode} - ${req.url}`);
			next();
		}
		
        server() { 
            if (this._server === null) {
                this.init();
                this.attachRoutes();
                this.staticFiles();

                this._server = this.app().listen(this._port, () => {
                    let host = this._server.address().address;
                    let port = this._server.address().port;
                    this.trigger(EVENT_TITAN_BOOT_SERVER_STARTED , [host, port]);
                });
            }

            return this._server;
        }

        attachRoutes() {
            if (!this._routesAttached) {
                this.config().routers().forEach((route) => 
					{
						Logger.info(`adding route : ${route.mount}`);
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
                Logger.info(`API Path is ${apiPath}`);
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
