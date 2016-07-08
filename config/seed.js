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
let ApplicationType = require('../src/application/applicationType/applicationType_model');
let Application = require('../src/application/application_model');

const Logger = require('../src/common/logger');

let testUserId = "";
let adminUserId = "";
let userRole = "";
let adminRole = "";
let tag1 = "";
let tag2 = "";
let tag3 = "";
let tags = [];
let carouselPageId = "";
let gamePageId = "";
let appId = "";
let appId2 = "";

populate_languages();
populate_tags();
populate_roles();
populate_settings();

function populate_applicationTypes() {
    Logger.info('starting to populate application types');

    ApplicationType.find({}).removeAsync()
        .then(() => {
            Logger.info('populating application types - after removeAsync');
            return ApplicationType.createAsync(
                {
                name: 'Game Launcher Slide Page',
                tags: [],
                nodes: [
                    {
                        nodeName: "Slide Image",
                        nodeType: "image",
                        required: true,
                        tags: []
                    },
                    {
                        nodeName: "Slide Top Title",
                        nodeType: "text",
                        required: true,
                        tags: []
                    },
                    {
                        nodeName: "Slide Main Title",
                        nodeType: "text",
                        required: true,
                        tags: []
                    },
                    {
                        nodeName: "Slide Info",
                        nodeType: "text",
                        required: true,
                        tags: []
                    }
                ],
                applications: []
            }
            )
                .then(() => {
                    Logger.info('finished populating application types');
                    ApplicationType.findAsync({name: "Game Launcher Slide Page"})
                        .then((appType) => {
                            carouselPageId = appType[0]._id;
                            Logger.info(`Slide Page is ${carouselPageId}`);
                            populate_applicationTypes2();
                        });
                });
        });
}

function populate_applicationTypes2() {
    Logger.info('starting to populate application types 2');

         ApplicationType.createAsync({
                name: 'Game Launcher Game Page',
                tags: [],
                nodes: [
                    {
                        nodeName: "Game Background Image",
                        nodeType: "image",
                        required: true,
                        tags: []
                    },
                    {
                        nodeName: "Game Logo Image",
                        nodeType: "image",
                        required: true,
                        tags: []
                    }
                ],
                applications: [
                    {
                        applicationType: carouselPageId,
                        minOccurs: 1,
                        maxOccurs: 5,
                        defaultNumber: 3
                    }
                ]
            })
            .then(() => {
                    Logger.info('finished populating application types 2');
                ApplicationType.findAsync({name: "Game Launcher Game Page"})
                    .then((appType) => {
                        gamePageId = appType[0]._id;
                        Logger.info(`Game Page is ${gamePageId}`);
                        populate_applications1();
                    });

            });

}

function populate_applications1() {
    Logger.info('starting to populate applications 1');

    Application.createAsync({
        name: 'Damian Slide Page 1',
        tags: [],
        user: testUserId,
        status: "active",
        applicationType: carouselPageId,
        nodes: [
            {
                name: "Slide Top Title",
                user: testUserId,
                type: "text",
                tags: [],
                content: [{
                    user: testUserId,
                    translated: false,                    
                    versionNo: 1,
                    versionMessage: 'version 1',
                    media: [
                        {
                            content: "Slide 1 Top Title",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }
                ]
            },
            {
                name: "Slide Main Title",
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
                            content: "Slide 1 Main Title",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }
                ]
            },
            {
                name: "Slide Info",
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
                            content: "Slide 1 Info",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }
                ]
            },
            {
                name: "Slide Image URL",
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
                            content: "Game Launcher\\Background\\rome.jpg",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }]
            }
        ],
        applicationGroups: []
    })
    .then(() => {
            Logger.info('finished populating applications 1');
            Application.findAsync({name: "Damian Slide Page 1"})
                .then((app) => {
                    appId = app[0]._id;
                    Logger.info(`Slide 1 Page is ${appId}`);
                    populate_applications2();
                });
        })
        .catch((e) => {
            Logger.info('caught error in populating applications 1');
            Logger.info(`Error is : ${JSON.stringify(e)}`);
        });

}

function populate_applications2() {
    Logger.info('starting to populate applications 2');

    Application.createAsync({
        name: 'Damian Slide Page 2',
        tags: [],
        user: testUserId,
        applicationType: carouselPageId,
        nodes: [
            {
            name: "Slide Top Title",
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
                content: "Slide 2 Top Title",
                language: {
                    name: "English",
                    iso3166: "EN"
                }
            }

        ]

    }
    ]
},
    {
        name: "Slide Main Title",
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
                content: "Slide 2 Main Title",
                language: {
                    name: "English",
                    iso3166: "EN"
                }
            }

        ]

    }
    ]
    },
    {
        name: "Slide Info",
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
                content: "Slide 2 Info",
                language: {
                    name: "English",
                    iso3166: "EN"
                }
            }

        ]

    }
    ]
    },
    {
        name: "Slide Image URL",
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
                content: "Game Launcher\\Background\\romeII.jpg",
                language: {
                    name: "English",
                    iso3166: "EN"
                }
            }

        ]

    }
    ]
    }
],
        applicationGroups: [
        ]
    })
        .then(() => {
            Logger.info('finished populating applications 2');
            Application.findAsync({})
                .then((app) => {
                    appId2 = app[1]._id;
                    Logger.info(`Slide 2 Page is ${appId2}`);
                    populate_applications3();
                });
        });

}

function populate_applications3() {
    Logger.info('starting to populate applications 3');
    Application.createAsync({
        name: 'Damian Game Page',
        tags: [],
        user: testUserId,
        publishable: true,
        applicationType: gamePageId,
        nodes: [
            {
                name: "Background Image",
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
                            content: "Game Launcher/Background/romeII.jpg",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }
                ]
            },
            {
                name: "Logo Image",
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
                            content: "Game Launcher/Logo/romeII.jpg",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            }
                        }

                    ]

                }
                ]
            }
        ],
        applicationGroups: [
            {
                name: 'Slides',
                tags: [],
                applications: [
                    appId,
                    appId2
                ]
            }
        ]
    }).then(() => {
        Logger.info('finished populating applications 3');
        Application.findAsync({})
            .then((app) => {
                Logger.info(`App is ${JSON.stringify(app[0])}`);
                Logger.info(`App is ${JSON.stringify(app[1])}`);
                Logger.info(`App is ${JSON.stringify(app[2])}`);
                Logger.info(`App is ${app[2].toJSON()}`);
            });
    });
}

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
                            populate_applicationTypes();
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
                                content: "Warhammer/Arena.png",
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
                                        iso3166: "ES"
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
                    description: "A lexicon for Games",
                    status: "active",
                    tags: [tag1, tag2]

                },
                {

                    name: "Game Launcher",
                    description: "A lexicon for the Game Launcher",
                    status: "active",
                    tags: [tag2, tag3]

                })
                .then(() => {
                    Logger.info('checking tags');
                    Lexicon.findAsync({name: "Games"})
                        .then((lex) => {
                            Logger.info(`Games lexicon has ${lex.length} tags`);
                        });
                });
        });
}

function populate_tags() {
    Logger.info('starting to populate tags');
    Tag.find({}).removeAsync()
        .then(() => {
            return Tag.createAsync({
                            name: "Game Launcher",
                            description: "Indicates the node is related to the Game Launcher",
                            status: "active"
                        },
                        {
                            name: "GL_BackgroundImage",
                            description: "Indicates the node references a background image for a Game Launcher game page",
                            status: "active"
                        },
                        {
                            name: "GL_LogoImage",
                            description: "Indicates the node references a logo image for a Game Launcher game page",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_001",
                            description: "Indicates the node relates to an instance of a Game Launcher carousel page in position 001",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_002",
                            description: "Indicates the node relates to an instance of a Game Launcher carousel page in position 002",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_003",
                            description: "Indicates the node relates to an instance of a Game Launcher carousel page in position 003",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_004",
                            description: "Indicates the node relates to an instance of a Game Launcher carousel page in position 004",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_005",
                            description: "Indicates the node relates to an instance of a Game Launcher carousel page in position 005",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_Image",
                            description: "Indicates the node relates to the image for an instance of a Game Launcher carousel page",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_TopTitle",
                            description: "Indicates the node relates to the top title for an instance of a Game Launcher carousel page",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_Info",
                            description: "Indicates the node relates to the text information for an instance of a Game Launcher carousel page",
                            status: "active"
                        },
                        {
                            name: "GL_Carousel_MainTitle",
                            description: "Indicates the node relates to the main title for an instance of a Game Launcher carousel page",
                            status: "active"

                })
                .then(() => {
                    Logger.info('checking tags');
                    Tag.findAsync({})
                        .then((tag) => {
                            tag1 = tag[0]._id;
                            tag2 = tag[1]._id;
                            tag3 = tag[2]._id;
                            tags = tag;
                            Logger.info(`Attila tag is ${tag[0]._id}`);
                            populate_lexicons();
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
                    name: "French",
                    iso3166: "FR"
                },
                {
                    name: "German",
                    iso3166: "DE"
                },
                {
                    name: "Spanish",
                    iso3166: "ES"
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
                    iso3166: "CZ"
                },
                {
                    name: "Korean",
                    iso3166: "KP"
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
                    driver: "Twitter",
                    config: [],
                    status: "active",
                    user: testUserId
                }
            );

        });
}