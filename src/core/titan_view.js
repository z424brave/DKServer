(function(){
    "use strict";

    let path = require("path");

    const GLOBAL = require("./titan_global");

    let FileExt = require("../common/file_ext");
    let Eventify = require("../common/eventify");

    const DEFAULT_ENGINE = "jade";
    const VIEW_ADAPTERS = "view_adapters";

    class TitanView extends Eventify {

        constructor(engine , engine_options) {
            super();
            this._engineName = engine || DEFAULT_ENGINE;
            this._engine = null;
            this._engineOptions = engine_options || {};
        }

        engine() {
            if( this._engine === null ) {
                if( !(FileExt.file_exists(this._adapterPath())) ) {
                    throw new Error(`Can not find adapter for ${ this._engineName }`);
                }

                let Adapter = require(this._adapterPath());
                this._engine = new Adapter(this._engineOptions);

                this.trigger("view.adapter.attached" , [this._engine, this._engineName]);
            }

            return this._engine;
        }

        render(view,data) {
            let rendered = this._engine().render(view, data);

            this.trigger("view.rendered" , [view,data,rendered]);

            return rendered;
        }

        _adapterPath() {
            return path.join(GLOBAL.CORE , VIEW_ADAPTERS, `${ this._engineName }.js`);
        }

    }

})();