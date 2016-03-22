'use strict';
//
let User = require('../src/user/user_model');
let Node = require('../src/node/node_model');
let Lexicon = require('../src/lexicon/lexicon/lexicon_model');
let Language = require('../src/language/language_model');

console.log('starting to populate users');

User.find({}).removeAsync()
    .then(() => {
        console.log('populating users - after removeAsync');		
        return User.createAsync({
                _id: "1233456789abcdefghuser01",
                name: 'Test User',
                email: 'test@creative-assembly.com',
                password: 'test',
                role: 'user',
                status: 'active',
                created: new Date(),
                updated: new Date()
            }, {
                _id: "1233456789abcdefgadmin02",
                name: 'Admin',
                email: 'admin@creative-assembly.com',
                password: 'admin',
                role: 'admin',
                status: 'active',
                created: new Date(),
                updated: new Date()
            })
            .then(() => {
                console.log('finished populating users');
            });
    });
console.log('starting to populate nodes');
Node.find({}).removeAsync()
    .then(() => {
        console.log('populating nodes - after removeAsync');		
        return Node.createAsync({
                _id: "1233456789abcdefghnode01",
                created: new Date(),
                name: "Node1",
                user: "1233456789abcdefghuser01",
                type: "text",
                status: "active",
                tags: ["1233456789abcdefghitag04","1233456789abcdefghitag05"],
                content: [{
                    user: "1233456789abcdefghuser01",
                    translated: false,
                    _id: "56aa0c23b6a175e513c5eec1",
                    versionNo: 1,
                    versionMessage: 'version 1',
                    media: [
                        {
                            content: "Content insert en",
                            language: {
                                name: "English",
                                iso3166: "EN"
                            },
                            _id: "1233456789abcdecomedia01"
                        },
                        {
                            language: {
                                name: "French",
                                iso3166: "FR"
                            },
                            content: "Content insert fr",
                            _id: "1233456789abcdecomedia01"
                        }
                    ]
                },

                    {
                        user: "1233456789abcdefghuser01",
                        translated: false,
                        _id: "56aa0c23b6a175e513c5eec2",
                        versionNo: 2,
                        versionMessage: 'version 2',
                        media: [
                            {
                                language: {
                                    name: "English",
                                    iso3166: "EN"
                                },
                                content: "Content insert EN",
                                _id: "1233456789abcdecomedia03"
                            },
                            {
                                language: {
                                    name: "French",
                                    iso3166: "FR"
                                },
                                content: "Content insert FR 2",
                                _id: "1233456789abcdecomedia04"
                            }
                        ]
                    }
                ]
            },

            {
                _id: "1233456789abcdefghnode02",
                created: new Date(),
                name: "Node2",
                user: "1233456789abcdefghuser01",
                type: "text",
                status: "active",
                tags: ["1233456789abcdefghitag02"],				
                content: [
                    {
                        user: "1233456789abcdefghuser01",
                        translated: false,
                        _id: "56aa0c23b6a175e513c5eec1",
                        versionNo: 1,
                        versionMessage: 'version 1',
                        media: [
                            {
                                content: "Good Morning",
                                language: {
                                    name: "English",
                                    iso3166: "EN"
                                },
                                _id: "1233456789abcdecomedia01"
                            },
                            {
                                language: {
                                    name: "French",
                                    iso3166: "FR"
                                },
                                content: "Bonjour",
                                _id: "1233456789abcdecomedia02"
                            }
                        ]
                    },

                    {
                        user: "1233456789abcdefghuser01",
                        translated: false,
                        _id: "56aa0c23b6a175e513c5eec2",
                        versionNo: 2,
                        versionMessage: 'version 2',
                        media: [
                            {
                                language: {
                                    name: "English",
                                    iso3166: "EN"
                                },
                                content: "Good Morning",
                                _id: "1233456789abcdecomedia03"
                            },
                            {
                                language: {
                                    name: "French",
                                    iso3166: "FR"
                                },
                                content: "Bonjour",
                                _id: "1233456789abcdecomedia04"
                            },
                            {
                                language: {
                                    name: "German",
                                    iso3166: "DE"
                                },
                                content: "Guten Morgen",
                                _id: "1233456789abcdecomedia05"
                            }							
                        ]
                    }
                ]
            }
        )
    });

console.log('starting to populate lexicons');
Lexicon.find({}).removeAsync()
    .then(() => {
        return Lexicon.createAsync({
                _id: "1233456789abcdelexicon01",
                name: "Games",
                status: "active",
                tags: [
                    {
                        _id: "1233456789abcdefghitag01",
                        name: "Warhammer"
                    },
                    {
                        _id: "1233456789abcdefghitag02",
                        name: "Attila"
                    },
                    {
                        _id: "1233456789abcdefghitag03",
                        name: "Sigmar"
                    }
                ]

            },
            {
                _id: "1233456789abcdelexicon02",
                name: "Type1",
                status: "active",
                tags: [
                    {
                        _id: "1233456789abcdefghitag04",
                        name: "Tag 4"
                    },
                    {
                        _id: "1233456789abcdefghitag05",
                        name: "Tag 5"
                    },
                    {
                        _id: "1233456789abcdefghitag06",
                        name: "Tag 6"
                    }
                ]

            })
    });


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

        )

    });