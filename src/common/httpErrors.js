(function(){
    "use strict";

    /**
     * A List of all the standard accepted HTTP error codes and a basic message describing each one
     *
     * @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     *
     * @type {{400: string, 401: string, 403: string, 404: string, 405: string, 406: string, 410: string, 418: string, 420: string, 426: string, 429: string, 500: string, 501: string, 502: string, 503: string}}
     *
     * @author Martin Haynes
     */

    module.exports = {
        400 : "Bad Request",
        401 : "Unauthorized",

        403 : "Forbidden",
        404 : "Not Found",
        405 : "Method Not Allowed",
        406 : "Not Acceptable",

        410 : "Gone",

        418 : "I'm a teapot",

        420 : "Enhance your Calm",

        426 : "Update Required",

        429 : "Too Many Requests",

        500 : "Internal Server Error",
        501 : "Not Implemented",
        502 : "Bad Gateway",
        503 : "Server Unavailable"
    };

})();