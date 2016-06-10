/*jshint sub:true*/
(function () {
    'use strict';
    const path = require("path");

    const TITAN_GLOBALS = require(`../core/titan_global`);
    const ApiController = require(`${ TITAN_GLOBALS.CORE}/controllers/titan_api_controller`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON}/logger`);
    const Config = require("config");
    
	let s3 = require('s3');
    let AWS = require('aws-sdk');
    
    const DEFAULT_REGION = "eu-west-1";
    const DEFAULT_BUCKET = "titan";

    const C_REGION = "AWS.region";
    const C_BUCKET = "AWS.s3.bucket";
    
    const s3region = Config.has(C_REGION) ? Config.get(C_REGION) : DEFAULT_REGION;
    const s3bucket = Config.has(C_BUCKET) ? Config.get(C_BUCKET) : DEFAULT_BUCKET;
	const delimiter = "/";
    const maxKeys = 1000;

	let client;
    let s3Client;
	
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
            Logger.info(`In S3Controller - ${s3region} / ${s3bucket}`);
			client = s3.createClient({region: s3region});
            s3Client = new AWS.S3(
                {region: s3region,
                 params: {Bucket: s3bucket}}
            );

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

        update() {

            let requestDirectory = this.req().query.dirName ? this.req().query.dirName + "/" : "";
            Logger.info(`In update in S3Controller - ${requestDirectory}`);
//            let params = S3Controller._setS3Params(requestDirectory);

            s3Client.putObject({Key: requestDirectory, Body: ''}, (err, data) => {
                if (err) {
                    console.log('error : ' + JSON.stringify(err));
                    this.send(err);
                } else {
                   console.log('success : ' + JSON.stringify(data));
                   this.send(data);
                }
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
