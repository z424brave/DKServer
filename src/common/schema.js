(function(){
    "use strict";

    let fs = require("fs");
    let _ = require("lodash");
    let FileExt = require("./file_ext");
    let Eventify = require("./eventify");

    const ENCODING = "utf8";
    const EVENT_INVALID = "schema.invalid";

    /**
     * Validates objects against a JSON Schema
     *
     * @class Schema
     * @module Common
     *
     * @author Martin Haynes
     */
    class Schema extends Eventify {
        constructor(schemaLocation) {
            if ( !(schemaLocation || false) ) {
                throw new Error("A Json Schema is required");
            }

            super();

            this.schemaFile = schemaLocation;
            this.schema = null;
            this._parsed = false;

            this.types = {};
            this.required = [];
            this.optional = [];

        }

        /**
         * Returns whether the object is valid against the Schema
         *
         * @param object {Object} the object to test the validity off
         * @param showFailureReport {Boolean} Why validation has failed
         *
         * @returns {Boolean} True is valid , false its not
         *
         * @author Martin Haynes
         */
        valid(object) {

            this.loadSchema();
            this.parseSchema();

            let validate = this._validate(this.analyse(object));

            if (!validate.valid ) {
                this.trigger(EVENT_INVALID, [validate]);
            }

            return validate.valid;
        }

        /**
         * Returns whether the object is invalid against the Schema
         *
         * @see valid
         *
         * @param object {Object} the object to test the validity off
         * @param showFailureReport {Boolean} Why validation has failed
         *
         * @returns {boolean} True is __NOT__ valid , false it __IS__ valid
         *
         * @author Martin Haynes
         */
        invalid(object, showFailureReport) {
            return !this.valid(object, showFailureReport);
        }

        /**
         * Loads a Schema Json file into the class
         *
         * @returns {Object} the object that represents the Schema
         *
         * @author Martin Haynes
         */
        loadSchema() {
            if ( this.schema === null ) {
                if (!FileExt.file_exists(this.schemaFile)) {
                    throw new Error(`The schema ${ this.schemaFile } doesn't exist`);
                }

                try {
                    this.schema = JSON.parse(fs.readFileSync(this.schemaFile), ENCODING);
                } catch (err) {
                    throw new Error(`Can not load the schema file ${ this.schemaFile }`);
                }
            }

            return this.schema;
        }

        /**
         * Process the Schema in to testable data
         *
         * @param schema = null {Object} The Schema to object to parse
         *
         * @author Martin Haynes
         */
        parseSchema(schema) {
            schema = schema || this.schema;
            if ( !this._parsed ) {
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        let value = schema[key];
                        if (this._isField(value)) {
                            this._processField(key, value);
                        } else {
                            this.types[key] = "object";
                            this.optional.push(key);
                            this.parseSchema(value);
                        }
                    }
                }
                this._parsed = true;
            }
        }

        /**
         * Analyses the Object that you are testing to be valid and creates a set of tokens for testing later on
         *
         * @param object {Object} The object that you wish to analyse
         *
         * @returns {{found: Array, foundTypes: {}}} an analyses report containing the results of the analyse
         *
         * @author Martin Haynes
         */
        analyse(object) {
            if( !this._isObject(object)) {
                throw new Error("Schema can only validate Objects");
            }

            let result = {found: [], foundTypes:{}};

            for(let key in object) {
                if ( object.hasOwnProperty(key) ) {
                    let value = object[key];
                    if ( this._smartType(value) === "object") {
                        let analyse = this.analyse(value);
                        let found = analyse.found;
                        let foundTypes = analyse.foundTypes;

                        result.found.concat(found);
                        result.foundTypes = _.extend(result.foundTypes , foundTypes);

                    }

                    result.found.push(key);
                    result.foundTypes[key] = this._smartType(value);

                }
            }

            return result;
        }

        /**
         * Used to validate an Object against the JSON Schema
         *
         * @see analyse
         *
         * @param report {{found: Array, foundTypes: {}}} The report generated by the analyser
         *
         * @returns {Boolean} true is valid agains the schema , false its not.
         *
         * @private
         *
         * @author Martin Haynes
         */
        _validate(report) {

            //let {found , foundTypes} = report;
            let found = report.found;
            let foundTypes = report.foundTypes;

            //console.log("VALIDATE" , this , "REPORT", report);

            let validateFields      = this._validateFields(found);
            let validateRequires    = this._validateRequires(found);
            let validateTypes       = this._validateTypes(foundTypes);

            return {
                valid: (validateFields.valid && validateRequires.valid && validateTypes.valid),
                fields: validateFields.errors,
                required: validateRequires.errors,
                types: validateTypes.errors
            };

        }

        /**
         * Validates if all the required fields are in the Object
         *
         * @param found {Array} The field list from the analyser report
         *
         * @returns {boolean} true it has all the required fields, false it does not
         *
         * @private
         *
         * @author Martin Haynes
         */
        _validateRequires(found) {
            let isValid = true;
            let error = [];

            if ( !!this.required.length && !found.length) {
                return false;
            }

            this.required.forEach((required) => {
               if (found.lastIndexOf(required) === -1) {
                   error.push(`REQUIRED field ${ required } is missing`);
                   isValid = false;
               }
            });

            return {valid: isValid , errors: error};
        }

        /**
         * validates the type of the actual object matches the types described in the schema
         *
         * @param foundTypes {{}} The foundType returned by the analyser
         *
         * @returns {boolean} True all the types are valid , false they aren't
         *
         * @private
         *
         * @author Martin Haynes
         */
        _validateTypes(foundTypes) {
            let isValid = true;
            let error = [];
            let dontTest = ["undefined", "null", undefined, null];

            for(let key in this.types ) {
                if( this.types.hasOwnProperty(key)) {
                    let type = this.types[key];

                    if (type !== "*" && dontTest.lastIndexOf(foundTypes[key]) === -1) {
                        if(foundTypes[key] !== type) {
                            error.push(`${ key } should have been ${ type } but was ${ foundTypes[key] }`);
                            isValid = false;
                        }
                    }
                }
            }

            return {valid: isValid , errors: error};
        }

        /**
         * Checks that every field in the oject is ether required or optional in the schema
         *
         * @param found {Array} The field list from the analyser report
         *
         * @returns {boolean} true they are all accounted for in the schema , false they dont
         *
         * @private
         *
         * @author Martin Haynes
         */
        _validateFields(found) {
            let isValid = true;
            let error = [];

            found.forEach((field) => {
                if (this.required.lastIndexOf(field) === -1 && this.optional.lastIndexOf(field) === -1) {
                    error.push(`${ field } is not allowed`);
                    isValid = false;
                }
            });

            return {valid: isValid , errors: error};
        }

        /**
         * Parses and process the validation for a set field in the schema
         *
         * @param name {string} The field name
         * @param rules {{type : String , required : Boolean}} The validation rules for that field
         *
         * @private
         *
         * @author Martin Haynes
         */
        _processField(name, rules) {
            this.types[name] = rules.type || "*";
            if (rules.required || false ) {
                this.required.push(name);
            } else {
                this.optional.push(name);
            }
        }

        /**
         * Checks to see if the object is a field or child object using Duck Typing
         *
         * @param object {{}} The field that you wish to test
         *
         * @returns {boolean} True it is a field , false its a child object
         *
         * @private
         *
         * @author Martin Haynes
         */
        _isField(object) {
            return (
                (object || false) &&
                this._isObject(object) &&
                (object.type || false) || (object.required || false)
            );
        }

        /**
         * Gets the type of a var , its smart as it can tell the difference between an Object and an Array
         *
         * @param of {*} What you wish to test
         *
         * @returns {string} The type name
         *
         * @private
         *
         * @author Martin Haynes
         */
        _smartType(of) {



            let dumbType = typeof(of);
            if ( dumbType !== "object") {
                return dumbType;
            } else {
                let smartType = Array.isArray(of) ? "array" : "object";
                return smartType;
            }
        }

        /**
         * Simple function to check if something is an object or not
         *
         * @see _smartType
         *
         * @param againt {*} What you wish to test
         *
         * @returns {boolean} True if it is an object , false it is not
         *
         * @private
         *
         * @author Martin Haynes
         */
        _isObject(againt) {
            return this._smartType(againt) === "object";
        }
    }

    module.exports = Schema;

})();