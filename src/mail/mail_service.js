(function () {
    'use strict';

    let nodemailer = require('nodemailer');

    const TITAN_GLOBALS = require('../core/titan_global');
    const Logger = require(`${TITAN_GLOBALS.COMMON}/logger`);

    class MailService {

        constructor() {

            this.transporter = this.initExchangeTransporter();

            //this.transporter.verify(function (error, success) {
            //    if (error) {
            //        Logger.error('Mail server connection error: ', error);
            //       // throw new Error('SES mail transporter connection failed');
            //
            //    } else {
            //        Logger.info('Mail Server is ready to take messages');
            //    }
            //});

        }

        sendUserPassword(user, password) {
            var mailOptions = {
                from: 'Titan admin<web@creative-assembly.com>',
                to: user.email,
                subject: 'Welcome to Titan',
                html: this.createWelcomeTemplate(user, password)
            };
            Logger.info(`Email - ${mailOptions.html}`);
            //this.transporter.sendMail(mailOptions, function (error, info) {
            //    if (error) {
            //        throw new Error(error);
            //    }
            //    Logger.info('Message sent: ' + info.response);
            //});
        }


        initExchangeTransporter(){

            var smtpExchange = {
                host: '10.10.5.90',
                port: 25,
                secure: false,
                tls: {rejectUnauthorized: false},
                debug:true
            };

            var transporter = nodemailer.createTransport(smtpExchange);
            return transporter;

        }

        initSESTransporter() {

            var smtpAmazon = {
                host: 'email-smtp.eu-west-1.amazonaws.com',
                port: 25,
                secure: true,
                auth: {
                    user: 'AKIAJLICSUPMCVVJ6WXA',
                    pass: 'AnERMBLFOWLyP/Lf3Hf+vvaV6eFCAO+sTJme7mE8boq1'
                }
            };

            //var smtpConfAMZ = 'smtps://AKIAJLICSUPMCVVJ6WXA:AnERMBLFOWLyP/Lf3Hf+vvaV6eFCAO+sTJme7mE8boq1@email-smtp.eu-west-1.amazonaws.com'

            var transporter = nodemailer.createTransport(smtpAmazon);
            return transporter;
        }

        createWelcomeTemplate(user, password) {
            var name = user.name;
            var template =
                `<h2>Dear ${name}</h2>
                 You can now login to Titan with your email address and following password: ${password}`;
            return template;

        }
    }

    module.exports = new MailService();


})();