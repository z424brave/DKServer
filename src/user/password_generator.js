(function () {
    'use strict';

    let generatePassword = require("password-generator");


    let maxLength = 12;
    let minLength = 8;
    let uppercaseMinCount = 1;
    let lowercaseMinCount = 3;
    let numberMinCount = 2;
    let specialMinCount = 0;
    let UPPERCASE_RE = /([A-Z])/g;
    let LOWERCASE_RE = /([a-z])/g;
    let NUMBER_RE = /([\d])/g;
    let SPECIAL_CHAR_RE = /([\?\-])/g;
    let NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

    function isStrongEnough(password) {
        var uc = password.match(UPPERCASE_RE);
        var lc = password.match(LOWERCASE_RE);
        var n = password.match(NUMBER_RE);
        var sc = password.match(SPECIAL_CHAR_RE);
        var nr = password.match(NON_REPEATING_CHAR_RE);
        return password.length >= minLength && ! nr &&
            uc && uc.length >= uppercaseMinCount &&
            lc && lc.length >= lowercaseMinCount &&
            n && n.length >= numberMinCount &&
            sc && sc.length >= specialMinCount;
    }


    class PasswordGenerator {

        generatePassword() {
            let password = "";
            let randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
            while (! isStrongEnough(password)) {
                password = generatePassword(randomLength, false, /[\w\d\?\-]/);
            }
            return password;
        }
    }

    module.exports = new PasswordGenerator();

})();