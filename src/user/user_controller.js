/*jshint sub:true*/
(function () {
    'use strict';

    let User = require('./user_model');
    let _ = require('lodash');
    let BaseController = require(`${ global.TITAN.CORE}/controllers/base_controller`);
    let passwordGenerator = require('./password_generator');
    let mailService = require('../mail/mail_service');

    class UserController extends BaseController {

        constructor() {
            super();
        }


        list(req, res) {

            User.find({}, '-salt -password')
                .then(users => {
                    res.status(200).json(users);
                })
                .catch(super.handleError(res));
        }

        get(req, res, next) {
            var userId = req.params.id;
            User.findOne({_id: userId}, '-salt -password')
                .then(user => {
                    if (! user) {
                        return res.status(401).end();
                    }
                    res.json(user);
                })
                .catch(super.handleError(res));
        }

        save(req, res) {
            var inputUser = req.body;
			var password = passwordGenerator.generatePassword();
			console.log(`In user_controller save - ${password}`);
            inputUser.password = password;
            var user = new User(inputUser);
			console.log(`In user_controller save 2 - ${user.password}`);			
            user.save()
                .then(super.responseWithResult(res, 'profile'))
                .then(user => {
                    mailService.sendUserPassword(inputUser, password);
                })
                .catch(super.handleError(res));
        }

        update(req, res) {
            var user = req.body;
            var that = this;
            User.findByIdAndUpdate(
                user._id, {
                    $set: {
                        name: user.name,
                        role: user.role,
                        email: user.email,
                        status: user.status
                    }
                })
                .then(super.handleEntityNotFound(res))
                .then(entity => {
                    User.findById(entity._id)
                        .exec(function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json(err);
                            }
                            res.json(result['profile']);
                        });
                })
                .catch(err => next(err));

        }

        delete(req, res) {
            var userId = req.params.id;
            User.findById(userId)
                .then(this.handleEntityNotFound(res))
                .then(user => {
                    user.status = 'deleted';
                    return user.save();
                })
                .then(super.respondWith(res, 200))
                .catch(super.handleError(res));
        }

        /**
         * Change a users password
         *
         changePassword(req, res, next) {
            var userId = req.user._id;
            var oldPass = String(req.body.oldPassword);
            var newPass = String(req.body.newPassword);

            User.findById(userId)
                .then(user => {
                    if (user.authenticate(oldPass)) {
                        user.password = newPass;
                        return user.save()
                            .then(() => {
                                res.status(204).end();
                            })
                            .catch(validationError(res));
                    } else {
                        return res.status(403).end();
                    }
                });
        }*/


        /**
         * Authentication callback
         *
         authCallback(req, res, next) {
            res.redirect('/');
        }*/
    }

    module.exports = new UserController();


})();
