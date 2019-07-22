class NLib {
    static ctor(factory) {
        let obj = {};
        if (!obj.prototype) obj.prototype = {};
        NLib.setCreateMethod(obj, factory);
        return obj;
    }
    static setCreateMethod(obj) {
        obj.create = (factory) => {
            let result;
            if (!factory) {
                result = {};
                result.prototype = Object.create(Object.prototype);
            }
            else {
                result = new factory();
                result.prototype = Object.create(factory.prototype);
            }
            return result;
        }
    }
}

/** internal nlib instance variables. @ignore */
NLib.instance = null;
NLib.version = '2.0.2';

nlib = (() => {
    let _instance = null;
    _getInstance = () => {
        if (!_instance)
            _instance = NLib.ctor();
        return _instance;
    }
    return { getInstance: _getInstance };
})().getInstance();

class NUtils {
    /**
     * Checks is object is null or undefined.
     *
     * @param {any} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is null otherwist returns false.
     */
    isNull(value) {
        // Note. Empty string is evaluate is null.
        return (!value || value === 'undefined');
    }
    /**
     * Checks is specificed string has white space.
     *
     * @param {string} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is contains one or more whitespace otherwise returns false.
     */
    hasWhiteSpace(value) {
        let ret = false;
        if (value) ret = value.indexOf(' ') >= 0;
        return ret;
    }
    /**
     * Checks is valid email address text.
     * 
     * @param {string} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is valid email format otherwist returns false.
     */
    isValidEmail(value) {
        let ret = false;
        if (value) {
            let expr = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
            var r = new RegExp(expr);
            ret = (value.match(r) == null) ? false : true;
        }
        return ret;
    }
    /**
     * get expired date from current date by specificed expired day(s).
     * if nothing assigned 1 day returns.
     * 
     * @param {Number} value The number of expires days start from today.
     * @returns {Date} Returns expired date. If no expiredDays assigned. one day will used.
     */
    getExpiredDate(expiredDays) {
        let date = new Date();
        let day = expiredDays;
        if (!expiredDays) day = 1;
        if (day < 1) day = 1;
        let seconds = 60 * 60 * 24 * day;
        date.setTime(date.getTime() + (seconds * 1000));
        return date;
    }
    /** Generate new Unique Id. */
    newUId() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
    /** init class prototype to nlib */
    static init() {
        if (!nlib.utils) {
            nlib.utils = nlib.create(NUtils);
        }
        else nlib.utils = nlib.utils;
    }
}
// init NUtils to nlib.
(() => { NUtils.init(); })();

class NNavigator {
    /**
     * Goto specificed url with supports assigned query string object.
     * 
     * @param {string} url The url to navigate.
     * @param {any} queryObject The object that all properties used as query string.
     */
    gotoUrl(url, queryObject) {
        let queryString = this.getQueryString(queryObject);
        //console.log(queryString);
        let newUrl = url + queryString;
        //console.log(newUrl);
        document.location.replace(newUrl);
    }
    /** Refresh url (force reload). */
    refresh() {
        document.location.reload(true);
    }
    /**
     * Checks Object contains one or more property.
     * @param {Object} obj The object that all properties used as query string.
     * @returns {Boolean} Returns true if Query Object contains one or more property.
     */
    hasHasProperties(obj) {
        return (obj && Object.keys(obj).length > 0);
    }
    /**
     * Checks key is exist in target object.
     * @param {Object} obj The Target Object instace to checks.
     * @param {String} key The property name.
     * @returns {Boolean} Returns true if Object contains key (property name).
     */
    hasProperty(obj, key) {
        return (obj && obj.hasOwnProperty(key));
    }
    /**
     * Gets Query string from specificed object.
     * @param {Object} obj The object that all properties used as query string.
     * @returns {String} Returns true if Object contains key (property name).
     */
    getQueryString(obj) {
        let queryString = '';
        if (this.hasHasProperties(obj)) {
            queryString = queryString + '?';
            let prefix = '';
            for (let key in obj) {
                if (this.hasProperty(obj, key)) {
                    let paramStr = key.toString() + '=' + obj[key].toString();
                    queryString = queryString + prefix + paramStr;
                    prefix = '&';
                }
            }
        }
        return queryString;
    }
    /** Clear query string from url. (call when page loaded). */
    clearQueryString() {
        var href = window.location.href;
        var newUrl = href.substring(0, href.indexOf('?'));
        window.history.replaceState({}, document.title, newUrl);
    }
    /** init class prototype to nlib */
    static init() {
        if (!nlib.nav) {
            nlib.nav = nlib.create(NNavigator);
        }
        else nlib.nav = nlib.nav;
    }
}
// init NNavigator to nlib.
(() => { NNavigator.init(); })();

/** NDelegate class. The .NET like delegate. */
class NDelegate {
    constructor() {
        this._locked = false;
        this._events = [];
    };
    //-- public methods.
    isFunction(value) {
        return (value && value instanceof Function);
    }
    indexOf(value) {
        let ret = -1;
        if (this.isFunction(value))
            ret = this._events.indexOf(value);
        return ret;
    };
    add(value) {
        if (this.isFunction(value)) {
            let index = this.indexOf(value);
            if (index === -1)
                this._events.push(value); // append.
            else this._events[index] = value; // replace.
        }
    };
    remove(value) {
        if (this.isFunction(value)) {
            let index = this.indexOf(value);
            if (index >= 0 && index < this._events.length) {
                this._events.splice(index, 1); // delete.
            }
        }
    };
    locked() { this._locked = true; };
    unlocked() { this._locked = false; };
    get isLocked() { return this._locked; };
    invoke(...args) {
        if (this._locked) return;
        let evtDataObj = this.createEventData(args);
        this._events.forEach((evt) => { this.raiseEvent(evt, evtDataObj); });
    };
    createEventData(...args) { return args; };
    raiseEvent(evt, evtDataObj) { evt(evtDataObj) };
};
/** EventHandler class. The .NET like EventHandler. */
class EventHandler extends NDelegate {
    //-- overrides
    getArgValue(arg, index) {
        let ret = null;
        if (arg && arg.length >= index + 1) ret = arg[index];
        return ret;
    }
    createEventData(...args) {
        let sender = null;
        let evtData = null;
        if (args && args.length >= 1) {
            sender = this.getArgValue(args[0], 0);
            evtData = this.getArgValue(args[0], 1);
            if (!evtData) { evtData = { sender: null, handled: false }; }
        }
        return { "sender": sender, "evtData": evtData }
    };
    raiseEvent(evt, evtDataObj) {
        let evtData = (!evtDataObj) ? { sender: null, handled: false } : evtDataObj.evtData;
        if (!evtData) { evtData = { handled: false }; }
        if (!evtData.handled) evtData.handled = false;
        if (!evtData.handled) { evt(evtDataObj.sender, evtData); }
    };
};
/** The Event Args class. The .NET like EventArgs. */
class EventArgs { static get Empty() { return null; } };

