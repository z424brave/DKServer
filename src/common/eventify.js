(function(){
    "use strict";

    const EVENT_ALL_ON = "all.on";
    const EVENT_ALL_ONCE = "all.once";
    const EVENT_ALL_OFF = "all.off";
    const EVENT_ALL_TRIGGER = "all.trigger";

    const VALID_ALL = [
        EVENT_ALL_ON,
        EVENT_ALL_ONCE,
        EVENT_ALL_OFF,
        EVENT_ALL_TRIGGER
    ];

    /**
     * Turns any class into an Event Emitter , Handler
     *
     * @class Eventify
     * @module Common
     *
     * @author Martin Haynes
     */
    class Eventify {
        /**
         * The Main Constructor Function
         */
        constructor() {
            this._queue = {};
            this._once = {};
            this._all = {};
        }

        /**
         * Identifies the class as been an Eventified class
         *
         * @returns {boolean} True it is an eventified class
         *
         * @author Martin Haynes
         */
        isEventify () {
            return true;
        }

        /**
         * Bind a persistent handler to the event, i.e. will be triggered every time the event is fired
         *
         * @param event {String} The Event name
         * @param handler {Function} The Event handler
         *
         * @author Martin Haynes
         */
        on (event , handler) {
            this.bind(event, handler, this._queue);
            this.trigger(EVENT_ALL_ON, [event, handler, this._queue]);
        }

        /**
         * Bind a single fire handler to the event, i.e. will be triggered once and then removed automatically
         *
         * @param event {String} The Event name
         * @param handler {Function} The Event handler
         *
         * @author Martin Haynes
         */
        once (event , handler) {
            this.bind(event, handler, this._once);
            this.trigger(EVENT_ALL_ONCE, [event, handler, this._once]);
        }

        /**
         * Binds a special all. event all. events are triggered by the event class itself
         *
         * @param event {String} A valid all. event name
         * @param handler {Function} The all. event handler
         */
        all (event , handler) {

            if ( !(event||false) ) {
                throw new Error("Event is required");
            }

            if (VALID_ALL.lastIndexOf(event) === -1 ) {
                throw new Error(`${ event } isn't a valid all event`);
            }

            this.bind(event, handler, this._all);
        }

        /**
         * Remove all the handlers for an Event
         *
         * @param event {String} The Event name to remove
         *
         * @author Martin Haynes
         */
        off (event) {
            this.unbind(event, this._once);
            this.unbind(event, this._queue);
            this.unbind(event, this._all);
        }

        /**
         * Trigger an event optionally parsing additional parameters to parse to the handler
         *
         * @param event {String} The Event name to trigger
         * @param params {Object} The Parameters to parse to the event handler
         *
         * @author Martin Haynes
         */
        trigger (event , params) {

            params = params || [];
            this.triggerQueue(event, params, this._queue);
            this.triggerQueue(event, params, this._once, true);
            this.triggerQueue(event, params, this._all);
        }

        /**
         * Bonds 2 event handlers so that events tiggered on the child , trigger handlers on the parent.
         *
         * @param child {Eventify} The child to bond with
         *
         * @author Martin Haynes
         */
        bond (child) {
            if ( !(typeof(child.isEventify) === "function" && child.isEventify()) ) {
                throw new Error("A Bond can only be established between two Eventified objects");
            }

            child.all(EVENT_ALL_TRIGGER , (e,args) => {
                this.trigger(e,args);
            });
        }

        /**
         * Describes the event queues already present allowing class to attach to them
         * this is mainly meant to be used by the bond
         *
         * @returns {{queue: ({}|*), once: ({}|*)}} The event queues
         *
         * @author Martin Haynes
         */
        describe () {
            let _this = this;
            return {
                "queue" : _this._queue,
                "once"  : _this._once,
                "all"   : _this._all
            };
        }

        /**
         * Binds a Trigger to an event in a single queue
         *
         * @private
         *
         * @param event {String} The Event name to bind to
         * @param handler {Function} The handler that you wish to bind
         * @param queue {Object} The Queue that you wish to bind to
         *
         * @author Martin Haynes
         */
        bind (event, handler, queue) {
            if (!(event||false)) {
                throw new Error("Event is required");
            }

            if (!(handler||false)) {
                throw new Error("Handler is required");
            }
            queue[event] = queue[event] || [];
            queue[event].push(handler);

        }

        /**
         * Unbinds a Trigger from an event in a single queue
         *
         * @private
         *
         * @param event {String} The Event name to unbind from
         * @param queue {Object} The Queue that you wish to remove the event from
         *
         * @author Martin Haynes
         */
        unbind (event, queue) {
            if (!(event||false)) {
                throw new Error("Event is required");
            }
            delete queue[event];
            this.trigger(EVENT_ALL_OFF, [event, queue]);
        }

        /**
         * Triggers all the handlers for a certain Event on a specified queue optionally unbinds them when complete
         *
         * @private
         *
         * @param event {String} The Event name to trigger
         * @param params {Object} The optional Parameters to parse to the handlers
         * @param queue {Object} The queue to trigger the event handlers on
         * @param clear = false {Boolean} Whether of not to clear the queue when done
         */
        triggerQueue (event, params, queue, clear) {

            if (!(event||false)) {
                throw new Error("Event is required");
            }

            clear = clear || false;

            if ( queue.hasOwnProperty(event)) {
                queue[event].forEach((handler) => {
                   handler.apply(null, params);
                });

                if ( clear ) {
                    this.unbind(event,queue);
                }
            }

            /*
                Guard otherwise the event trigger will trigger all.trigger that will trigger event trigger!
                and as fun as it is to try and debug callback loops lets not hay!
            */
            if ( event !== EVENT_ALL_TRIGGER ) {
                this.trigger(EVENT_ALL_TRIGGER, [event, params, queue, clear]);
            }
        }
    }

    module.exports = Eventify;

})();