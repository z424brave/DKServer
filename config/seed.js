'use strict';
//
let User = require('../src/user/user_model');
let Node = require('../src/node/node_model');
let Lexicon = require('../src/lexicon/lexicon/lexicon_model');
let Tag = require('../src/lexicon/tag/tag_model');
let Language = require('../src/language/language_model');
let Role = require('../src/role/role_model');
let Channel = require('../src/channels/model/channels');
let Field = require('../src/channels/model/field_schema');

const Logger = require('../src/common/logger');

let testUserId = "";
let adminUserId = "";
let userRole = "";
let adminRole = "";

populate_languages();
populate_lexicons();
populate_roles();
populate_settings();

function populate_settings() {
    Logger.info('starting to populate settings');

    Field.find({}).removeAsync()
        .then(() => {
            Logger.info('populating fields - after removeAsync');
            return Field.createAsync({
                name: 'Facebook Api Key',
                type: 'string'
            }, {
                name: 'Facebook Secret',
                type: 'string'
            }, {
                name: 'Twitter Secret Key',
                type: 'string'
            }, {
                name: 'Twitter Api Key',
                type: 'string'
            }, {
                name: 'Twitter Username',
                type: 'string'
            })
                .then(() => {
                    Logger.info('finished populating fields');
                });
        });
}

function populate_users() {
    Logger.info('starting to populate users');

    User.find({}).removeAsync()
        .then(() => {
            Logger.info('populating users - after removeAsync');
            return User.createAsync({
                    name: 'Test User',
                    email: 'test@creative-assembly.com',
                    password: 'test',
                    roles: ['user'],
//                    roles: [userRole],
                    status: 'active'
                }, {
                    name: 'Admin',
                    email: 'admin@creative-assembly.com',
                    password: 'admin',
 //                   roles: [adminRole, userRole],
                    roles: ['admin', 'user'],
                    status: 'active'
                })
                .then(() => {
                    Logger.info('finished populating users');
                    User.findAsync({name: "Test User"})
                        .then((user) => {
                            testUserId = user[0]._id;
                            Logger.info(`Test User id is ${testUserId}`);
                            populate_nodes();
                            populate_channels();
                        });
                });
        });
}

function populate_nodes() {
    Logger.info('starting to populate nodes');
    Node.find({}).removeAsync()
        .then(() => {
            Logger.info('populating nodes - after removeAsync');
            return Node.createAsync({
                    name: "Node0",
                    user: testUserId,
                    type: "image",
                    status: "active",
                    tags: [],
                    content: [{
                        user: testUserId,
                        translated: false,
                        versionNo: 1,
                        versionMessage: 'version 1',
                        media: [
                            {
                                content: "launcher/Arena.png",
                                language: {
                                    name: "English",
                                    iso3166: "EN"
                                }
                            }
                        ]
                    }]
                },
                { name: "Node1",
                    user: testUserId,
                    type: "text",
                    status: "active",
                    tags: [],
                    content: [{
                        user: testUserId,
                        translated: false,
                        versionNo: 1,
                        versionMessage: 'version 1',
                        media: [
                            {
                                content: "Content insert en",
                                language: {
                                    name: "English",
                                    iso3166: "EN"
                                }
                            },
                            {
                                language: {
                                    name: "French",
                                    iso3166: "FR"
                                },
                                content: "Content insert fr"
                            }
                        ]
                    },
                        {
                            user: testUserId,
                            translated: false,
                            versionNo: 2,
                            versionMessage: 'version 2',
                            media: [
                                {
                                    language: {
                                        name: "English",
                                        iso3166: "EN"
                                    },
                                    content: "Content insert EN"
                                },
                                {
                                    language: {
                                        name: "French",
                                        iso3166: "FR"
                                    },
                                    content: "Content insert FR 2"
                                }
                            ]
                        }]
                },
                {
                    name: "Node2",
                    user: testUserId,
                    type: "text",
                    status: "active",
                    tags: [],
                    content: [
                        {
                            user: testUserId,
                            translated: false,
                            versionNo: 1,
                            versionMessage: 'version 1',
                            media: [
                                {
                                    content: "Hello hello",
                                    language: {
                                        name: "English",
                                        iso3166: "EN"
                                    }
                                },
                                {
                                    language: {
                                        name: "French",
                                        iso3166: "FR"
                                    },
                                    content: "Allo allo"
                                }
                            ]
                        },

                        {
                            user: testUserId,
                            translated: false,
                            versionNo: 2,
                            versionMessage: 'version 2',
                            media: [
                                {
                                    language: {
                                        name: "English",
                                        iso3166: "EN"
                                    },
                                    content: "Good Morning"
                                },
                                {
                                    language: {
                                        name: "French",
                                        iso3166: "FR"
                                    },
                                    content: "Bonjour"
                                },
                                {
                                    language: {
                                        name: "German",
                                        iso3166: "DE"
                                    },
                                    content: "Guten Morgen"
                                },
                                {
                                    language: {
                                        name: "Spanish",
                                        iso3166: "SP"
                                    },
                                    content: "Buenos Días"
                                }
                            ]
                        }
                    ]
                }
            );
        });
}

function populate_lexicons() {
    Logger.info('starting to populate lexicons');
    Lexicon.find({}).removeAsync()
        .then(() => {
            return Lexicon.createAsync({

                    name: "Games",
                    status: "active",
                    tags: [
                        {
                            name: "Warhammer"
                        },
                        {
                            name: "Attila"
                        },
                        {
                            name: "Sigmar"
                        }
                    ]

                },
                {

                    name: "Lexicon 2",
                    status: "active",
                    tags: [
                        {
                            name: "Tag 4"
                        },
                        {
                            name: "Tag 5"
                        },
                        {
                            name: "Tag 6"
                        }
                    ]

                })
                .then(() => {
                    Logger.info('checking tags');
                    Lexicon.findAsync({name: "Games"})
                        .then((lex) => {
                            Logger.info(`Warhammer tag is ${lex[0].tags[0]._id}`);
                        });
                });
        });
}

function populate_roles() {
    Logger.info('starting to populate roles');
    Role.find({}).removeAsync()
        .then(() => {
            return Role.createAsync(
                {
                    name: "admin",
                    description: "The administrator role"
                },
                {
                    name: "user",
                    description: "The basic user role"
                }

            ).then(() => {
                Role.findAsync({name: "user"})
                    .then((role) => {
                        userRole = role[0]._id;
                        Logger.info(`User Role is ${userRole}`);
                    }).then(() => {
                    Role.findAsync({name: "admin"})
                        .then((role) => {
                            adminRole = role[0]._id;
                            Logger.info(`Admin Role is ${adminRole}`);
                            populate_users();
                        });
                });
            });
        });
}

function populate_languages() {
    Logger.info('starting to populate languages');
    Language.find({}).removeAsync()
        .then(() => {
            return Language.createAsync(
                {
                    name: "English",
                    iso3166: "EN"
                },
                {
                    name: "french",
                    iso3166: "FR"
                },
                {
                    name: "German",
                    iso3166: "DE"
                },
                {
                    name: "Spanish",
                    iso3166: "SP"
                },
                {
                    name: "Italian",
                    iso3166: "IT"
                },
                {
                    name: "Russian",
                    iso3166: "RU"
                },
                {
                    name: "Turkish",
                    iso3166: "TR"
                },
                {
                    name: "Czech",
                    iso3166: "CS"
                },
                {
                    name: "Korean",
                    iso3166: "KO"
                }
            );

        });
}

function populate_channels() {
    Logger.info('starting to populate channels');
    Channel.find({}).removeAsync()
        .then(() => {
            return Channel.createAsync(
                {
                    name: "Twitter Channel",
                    driver: "Twitter Driver",
                    config: [],
                    status: "active",
                    user: testUserId
                }
            );

        });
}