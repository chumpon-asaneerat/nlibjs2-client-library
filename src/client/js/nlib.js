class NLib { }

NLib.instance = null;
NLib.helpers = null;

NLib.ctor = (factory) => {
    let obj = {};
    if (!obj.prototype) obj.prototype = {};
    NLib.setCreateMethod(obj, factory);
    NLib.setHelpersProperty(obj);
    return obj;
}

NLib.setCreateMethod = (obj) => {
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

NLib.setHelpersProperty = (obj) => {
    // define helpers
    Object.defineProperty(obj, 'helpers', {
        get: function () {
            if (!NLib.helpers)
                NLib.helpers = new NLib.Helper(obj);
            return NLib.helpers;
        }
    });
}

NLib.Helper = class {
    constructor(nlib_instance) {
        /** internal nlib instance. */
        this._nlib = nlib_instance;
        /** the helper module name. */
        this.ModuleName = 'Helpers';
    }
    registerCodeAddIn(instance, addInName, getMethod) {
        if (!instance) {
            console.log('instance is null.');
            return;
        }
        //console.log("Module Name: " + addInName);
        Object.defineProperty(instance, addInName, {
            configurable: true,
            get: getMethod
        });
    }
}

nlib = (() => {
    let _instance = null;
    _getInstance = () => {
        if (!_instance)
            _instance = NLib.ctor();
        return _instance;
    }
    return { getInstance: _getInstance };
})().getInstance();

class Navigator {
    gotoUrl(url, queryObject) {
        console.log('gotoUrl');
    }
    refresh() {
        console.log('refresh');
    }
    static init() {
        if (!nlib.nav) {
            nlib.nav = nlib.create(Navigator);
        }
        else nlib.nav = nlib.nav;
    }
}
// init Navigator to nlib.
(() => { Navigator.init() })();