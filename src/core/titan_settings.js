(function(){
    "use strict";

    let path = require("path");
    let os = require("os");
    let _ = require("lodash");

	const TITAN_GLOBALS = require("./titan_global");

    const JsonFile = require(`${TITAN_GLOBALS.COMMON}/json_file`);
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);

    const DEFAULT_ENV = "dev";
    const EXT = "json";
    const HUNT = ['default' , '<%= env %>', '<%= env %>.ext' , '<%= env %>.<%= hostname %>' , 'local'];

    class TitanSettings {

        constructor(settingsPath) {
            this._wipe();
            this._settingsPath = settingsPath || process.env.TITAN_SETTINGS || TITAN_GLOBALS.SETTINGS;
        }

        /**
         * Returns or creates and returns the configuration data, it works by looking through the list of all the
         * possible setting files and extends the last one with the next on building up the final settings
         *
         * @see HUNT for list of all the setting files
         *
         * @returns {JsonFile} returns a JSON file object containing the complete configuration file
         *
         * @author Martin Haynes
         */
        config() {
            if( this._config === null ) {
                let vars = {
                    'env': process.env.NODE_ENV || DEFAULT_ENV,
                    'hostname': os.hostname()
                };

                HUNT.forEach((using) => {

                    let _template = _.template(using);
                    let _path = path.join(this._settingsPath, `${ _template(vars) }.${ EXT }`);
                    let _file = new JsonFile(_path);

                    if ( ! _file.exists() ) {
                        Logger.warn(`${ _path } was not found`);
                        return;
                    }

                    _file.loadSync();

                    if ( this._config === null ) {
                        this._config = _file;
                    } else {
                        this._config.extend(_file);
                    }
                });

            }

            return this._config;
        }

        /**
         * Wipes the config data , forcing it to be reload on the next call to #config()
         *
         * @private
         *
         * @author Martin Haynes
         */
        _wipe() {
            this._config = null;
        }

        /**
         * Gets a configuration file from a path string
         *
         * @see Collection::find
         *
         * @param key {string} The path string to look up
         * @param settingsPath {string|null} = null The path to the settings file to use
         *
         * @returns {*} The file of the key specified in the path
         *
         * @author Martin Haynes
         */
        static get(key , settingsPath) {
            settingsPath = settingsPath || null;
            return TitanSettings.instance(settingsPath).config().find(key);
        }

        /**
         * Checks whether a path sting exists in the config
         *
         * @see Collection::has
         *
         * @param key {string} The path string to look up
         * @param settingsPath {string|null} = null the path to the setting file to use
         *
         * @returns {Boolean} True it exists , false it deos not
         *
         * @author Martin Haynes
         */
        static has(key , settingsPath) {
            settingsPath = settingsPath || null;
            return TitanSettings.instance(settingsPath).config().has(key);
        }

        /**
         * Resets the class used when the data changes
         *
         * @author Martin Haynes
         */
        static reset() {
            TitanSettings.__instance = null;
        }

        /**
         * Singleton
         *
         * @param settingsPath {string} The path to the settings file
         *
         * @returns {TitanSettings} the single instance of this class
         *
         * @author Martin Haynes
         */
        static instance(settingsPath) {
            settingsPath = settingsPath || null;
            TitanSettings.__instance = TitanSettings.__instance || null;

            if ( TitanSettings.__instance === null ) {
                TitanSettings.__instance = new TitanSettings(settingsPath);
            }

            return TitanSettings.__instance;
        }

    }

    module.exports = TitanSettings;

})();