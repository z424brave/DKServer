(function(){
    "use strict";

    const Config = require("config");
    const aws = require('aws-sdk');

    const TITAN_GLOBALS = require("../core/titan_global");
    const TitanInitBase = require(`${ TITAN_GLOBALS.CORE }/titan_init_base`);
    const Logger = require(`${ TITAN_GLOBALS.COMMON }/logger`);

    const DEFAULT_REGION = "eu-west-1";
    const DEFAULT_FROMEMAILADDRESS = "web@creative-assembly.com";
    const DEFAULT_ADMINTOMEMAILADDRESS = "Damian.Kelly@creative-assembly.com";

    const C_REGION = "AWS.region";
    const C_FROMEMAILADDRESS = "AWS.ses.fromEmailAddress";
    const C_TOEMAILADDRESS = "AWS.ses.toEmailAddress";

    class MailInit extends TitanInitBase {

        constructor() {

            super();

        }

        init() {

            const region = Config.has(C_REGION) ?
                Config.get(C_REGION) : DEFAULT_REGION;
            const fromEmailAddress = Config.has(C_FROMEMAILADDRESS) ?
                Config.get(C_FROMEMAILADDRESS) : DEFAULT_FROMEMAILADDRESS;
            const toEmailAddress = Config.has(C_TOEMAILADDRESS) ?
                Config.get(C_TOEMAILADDRESS) : DEFAULT_ADMINTOMEMAILADDRESS;

            let ses = new aws.SES({region: region});

            let messageData = `Titan server started in ${process.env.NODE_ENV || "dev"} env`;

            ses.sendEmail( {
                Source: fromEmailAddress,
                Destination: { ToAddresses: [toEmailAddress] },
                Message: {
                    Subject: {
                        Data: 'Titan Server Starting'
                    },
                    Body: {
                        Text: {
                            Data: messageData,
                        }
                    }
                }
            }, (err, data) => {
                if(err) {
                    Logger.error(`Email failed: ${JSON.stringify(err)}`);
                } else {
                    Logger.info(`Email sent: ${JSON.stringify(data)}`);
                }
            });

        }

    }

    module.exports = MailInit;

})();
