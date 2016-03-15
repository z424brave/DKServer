(function(){
    "use strict";

    let expect = require("chai").expect;
    let path = require("path");
    let Helpers = require('../helpers');
    let TitanConfig = require("../../src/core/titan_config");

    const MOCK_PATH = "spec/mocks/titan_config";
    const MOCK_VALID = "valid";
    const MOCK_INVALID = "invalid";
    const FULL_MOCK_VALID = path.join(process.cwd(), MOCK_PATH , MOCK_VALID);
    const FULL_MOCK_INVALID = path.join(process.cwd(), MOCK_PATH , MOCK_INVALID);
    const CONFIG_TITAN = "titan.json";

    describe("TitanConfig" , () => {

        describe("#constructor()", () => {

            it("should throw an Error when no path is passed" , () => {

                let fn = () => {
                    let subject = new TitanConfig();
                    expect(subject._path).to.equal(null);
                };

                expect(fn).to.throw("Titan Config - Required a configuration path");
            });

            it("should set the path on initialization with a path" , () => {
               let subject = new TitanConfig(FULL_MOCK_VALID);
                expect(subject._path).to.equal(FULL_MOCK_VALID);
            });

        });

        describe("#path()" , () => {

            it("should return the initialization path" , () => {
               let subject = new TitanConfig(FULL_MOCK_VALID);
               expect(subject.path()).to.equal(FULL_MOCK_VALID);
            });

        });

        describe("#configFile()" , () => {

            it("should return the full path with the titan file name" , () => {
                let subject = new TitanConfig(FULL_MOCK_VALID);
                expect(subject.configFile()).to.equal(path.join(FULL_MOCK_VALID , CONFIG_TITAN));
            });

        });

        describe("#loadConfig()" , () => {

            it ("should load the config" , () => {
                let subject = new TitanConfig(FULL_MOCK_VALID);
                let mock = Helpers.loadJson(path.join(FULL_MOCK_VALID, CONFIG_TITAN));

                subject.loadConfig();

                expect(subject.length()).to.be.above(0);
                expect(subject.data()).to.deep.equal(mock);
            });

            it ("should throw an error on loading an invalid config" , () => {

                let fn = () => {
                    let subject = new TitanConfig(FULL_MOCK_INVALID);
                    subject.loadConfig();
                };

                expect(fn).to.throw(`The config file ${ path.join(FULL_MOCK_INVALID, CONFIG_TITAN) } isn't a valid Titan Config File`);

            });

        });

        describe("#find()" , () => {

            it ("should find data based on a string" , () => {
                let subject = new TitanConfig(FULL_MOCK_VALID);
                let mock = Helpers.loadJson(path.join(FULL_MOCK_VALID, CONFIG_TITAN));

                subject.loadConfig();

                expect(subject.find("version")).to.equal(mock.version);
            });

            it ("should load and find data based on a string" , () => {
                let subject = new TitanConfig(FULL_MOCK_VALID);
                let mock = Helpers.loadJson(path.join(FULL_MOCK_VALID, CONFIG_TITAN));

                expect(subject.find("init")).to.equal(mock.init);
            });

        });

    });

})();