(function(){
    "use strict";

    let path = require("path");
    let expect = require("chai").expect;
    let Helpers = require("../helpers");
    let TitanSettings = require("../../src/core/titan_settings");

    const MOCK = path.join(Helpers.MOCK() , "titan_settings");
    const MOCK_BASIC = path.join(MOCK , "basic");
    const MOCK_EXTEND = path.join(MOCK, "extend");

    describe("TitanSettings" , () => {

        beforeEach(() => {
           TitanSettings.reset();
        });

        it("should load a basic default configuation file" , () => {

            let defaultJson = {
                "foo" : "bar",
                "a" : "b",
                "c" : 1,
                "d" : false
            };

            expect(TitanSettings.get("foo" , MOCK_BASIC)).to.equal(defaultJson.foo);
            expect(TitanSettings.has("c" , MOCK_BASIC)).to.be.true;

        });

        it("should load and extend data" , () => {
            expect(TitanSettings.get("foo" , MOCK_EXTEND)).to.equal("foobar");
        });

        it("should allow you to set the config path with an ENV var" , () => {
            process.env.TITAN_SETTINGS = MOCK_BASIC;
            expect(TitanSettings.get("foo")).to.equal("bar");
        });
    });

})();