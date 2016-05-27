(function(){
    "use strict";

    let path = require("path");

	const CONFIG_TITAN = "titan.json";
    const TITAN_SCHEMA = "titan_config.json";
    const TITAN_GLOBALS = require("./titan_global");
    let JsonFile = require(`${ TITAN_GLOBALS.COMMON }/json_file`);
    let Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    /**
     * A Class for handling Titan Configuration files
     *
     * @class TitanConfig
     * @extends JsonFile
     * @module Core
     *
     * @author Martin Haynes
     */
    class TitanConfig extends JsonFile {
        constructor(configPath) {

            if (!configPath) {
                throw new Error("Titan Config - Required a configuration path");
            }

            super(null, path.join(`${ TITAN_GLOBALS.SCHEMA }`, TITAN_SCHEMA));
            this.path(configPath);
        }

        /**
         * Set the path to look for a configuration file in
         *
         * @param path = false {String|Boolean} the path to set
         *
         * @returns {string|null} returns the path or if its never been set null
         */
		 
        path(path) {
            if (path || false ) {
                this._path = path;
            }

            return this._path;
        }

        /**
         * Return the calculated path to the config file
         *
         * @returns {*|string} The calculated Path
         *
         * @author Martin Haynes
         */
        configFile() {
            return path.join(this.path() , CONFIG_TITAN);
        }

        /**
         * Populates the collection with the data from the configuration file
         *
         * @author Martin Haynes
         */
        loadConfig() {
            this.filename(this.configFile());
            this.loadSync();

            this.on("schema.invalid" , (err) => {
               Logger.error(err);
            });

            if ( this.invalid() ) {
                throw new Error(`The config file ${ this.configFile() } isn't a valid Titan Config File`);
            }
        }


        /**
         * Find data within Titan config using a path
         *
         * @see Collection::find
         *
         * @param path = false {String|Boolean} the path to the value you want
         * @returns {*} returns the value of the variable at the path or false
         *
         * @author Martin Haynes
         */
        find(path) {
            if ( !this._loaded ) {
                this.loadConfig();
            }

            return super.find(path);
        }

    }

    module.exports = TitanConfig;

})();