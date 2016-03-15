(function(){
    "use strict";

    let expect = require('chai').expect;
    let path = require('path');
    let _ = require('lodash');
    let Helpers = require("../helpers");
    let TitanModules = require("../../src/core/titan_modules");

    const MOCK_PATH = path.join(Helpers.MOCK(), "titan_modules");
    const MOCK_VALID_PATH = path.join(MOCK_PATH , "valid");

    describe("TitanModules", () => {

        describe("#consturctor()" , () => {

            it("should initialize the class when a root is given" , () => {

                let mock_path = "/foobar";
                let subject = new TitanModules(mock_path);

                expect(subject._rootTitan).to.equal(mock_path);
            });

            it("should throw an error if there is no root titan file" , () => {

                let fn = () => {
                    let subject = new TitanModules();
                };

                expect(fn).to.throw("Can not load root Titan file");

            });

        });

        describe("#application()" , () => {

            it("should load a application config" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH);
                let subject = titanModules.application();

                expect(subject.isCollection()).to.be.true;
                expect(subject.has("name")).to.be.true;

            });

            it("should return a loaded application config" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH);
                titanModules.application();
                let subject = titanModules.application();

                expect(subject.isCollection()).to.be.true;
                expect(subject.has("name")).to.be.true;

            });

        });

        describe("#modules()" , () => {

            it("should load all modules" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.modules();

                expect(subject).to.be.an("object");
                expect(subject).not.to.be.empty;
                expect(subject[_.keys(subject)[0]].isCollection()).to.be.true;
                expect(subject[_.keys(subject)[0]].has("name")).to.be.true;

            });

            it("should return all the loaded module config" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                titanModules.modules();
                let subject = titanModules.modules();

                expect(subject).to.be.an("object");
                expect(subject).not.to.be.empty;
                expect(subject[_.keys(subject)[0]].isCollection()).to.be.true;
                expect(subject[_.keys(subject)[0]].has("name")).to.be.true;

            });

        });

        describe("#modulePath()" , () => {

            it("should load return the module paths" , () => {


            });

        });

        describe("#routers()" , () => {

            it("should return an array of router objects" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.routers();

                expect(subject).to.be.an("array");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("mount");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("router");

            });

        });

        describe("#admin()" , () => {

            it("should return an array of admin router objects" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.admin();

                expect(subject).to.be.an("array");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("mount");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("router");
            });

        });

        describe("#api()" , () => {

            it("should return an array of api router objects" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.api();

                console.log(subject);

                expect(subject).to.be.an("array");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("mount");
                expect(subject[Helpers.randomInt(0,subject.length)]).to.have.property("router");
            });

        });


        describe("#module" , () => {

            it("should return a module by name" , () => {

                let modulename = "titan.test.module1";

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.module(modulename);

                expect(subject.name).to.equal(modulename);
                expect(subject.length()).to.be.above(0);

            });

            it("should throw an error when no name is specified" , () => {

                let fn = () => {
                    let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                    let subject = titanModules.module();
                };

                expect(fn).to.throw("moduleName is required");

            });

            it("ahould return null when no module name is specified" , ()  => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subect = titanModules.module("foo.bar");

                expect(subect).to.equal(null);

            });

        });

        describe("#inits()" , () => {

            it("should return an array of all the inits" , () => {

                let titanModules = new TitanModules(MOCK_VALID_PATH, MOCK_VALID_PATH);
                let subject = titanModules.inits();

                expect(subject).to.be.an("array");
                expect(subject).to.have.length.above(0);
            });

        });

    });

})();