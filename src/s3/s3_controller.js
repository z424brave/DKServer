/*jshint sub:true*/
(function () {
    'use strict';
    const path = require("path");

    const TITAN_GLOBALS = require(`../core/titan_global`);
    const ApiController = require(`${ TITAN_GLOBALS.CORE}/controllers/titan_api_controller`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON}/logger`);

	let s3 = require('s3');

    const s3region = "eu-west-1";
    const s3bucket = "titanclient";
	const delimiter = "/";
    const maxKeys = 1000;

	var client;
	
    class S3Controller extends ApiController {

        constructor(req, res) {
            
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Lexicon",
                "PUT /:id"      : "Update an existing Lexicon",
                "DELETE /:id"   : "Deletes an existing Lexicon",
                "GET /:id"      : "Get the data for a specific lexicon",
                "GET /list"     : "List all the existing Lexicons"
            });

			client = s3.createClient({region: s3region});
			
        }

        list() {
			
			let requestDirectory = this.req().query.dirName ? this.req().query.dirName : "";
			Logger.info(`In list in S3Controller - ${requestDirectory}`);
			let params = S3Controller._setS3Params(requestDirectory);
			
			let downloader = client.listObjects(params);

			downloader.on('data', (data) => {
                Logger.info(`S3 returns - ${JSON.stringify(data)}`);
				this.send(data);
			});

        }
 
		static _setS3Params(prefix) {
			
			let params = {};

			params.s3Params = {};
			params.s3Params.Bucket = s3bucket;
			params.s3Params.Delimiter = delimiter;
			params.s3Params.MaxKeys = maxKeys;

            params.s3Params.Prefix = prefix ? prefix + delimiter : "";
            Logger.info(`Params are - ${JSON.stringify(params)}`);
			return params;	
			
		}
	}
	
    module.exports = S3Controller;

})();
