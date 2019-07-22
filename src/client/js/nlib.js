class nlib {
    static get version() { return '2.0.1'; }
}

class Cookies {
    constructor() {
        this.defaults = {};
    }
    get(key) {
        return Cookies.read(this, key);
    }
    set(key, value, attributes) {
        Cookies.write(this, key, value, attributes);
    }
    remove(key, attributes) {
        Cookies.write(this, key, '', Cookies.extend(attributes, { expires: -1 }));
    }
    getJSON() {
        return Cookies.apply({ json: true }, [].slice.call(arguments));
    }

    static extend() {
        let result = {};
        for (let i = 0; i < arguments.length; i++) {
            let attributes = arguments[i];
            for (let key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    static get isDocumentExist() { return (typeof document !== 'undefined'); }
    static setExpireDate(attributes) {
        if (typeof attributes.expires === 'number') {
            let expires = new Date();
            expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
            attributes.expires = expires;
        }
    }

    static formatToWrite(key, value) {
        let result, rKey = key, rVal = value;
        try {
            result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
                rVal = result;
            }
        } catch (e) { }
        let expr1 = /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g
        rVal = encodeURIComponent(String(rVal)).replace(expr1, decodeURIComponent);        
        rKey = encodeURIComponent(String(key));
        let expr2 = /%(23|24|26|2B|5E|60|7C)/g
        rKey = rKey.replace(expr2, decodeURIComponent);
        let expr3 = /[\(\)]/g
        rKey = rKey.replace(expr3, escape);
        return { key: rKey, value: rVal };
    }
    static get documentCookies() {
        return document.cookie ? document.cookie.split('; ') : [];
    }
    static writeToDocument(attributes, obj) {
        let sCookie = [
            obj.key, '=', obj.value,
            // use expires attribute, max-age is not supported by IE
            attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '',
            attributes.path ? '; path=' + attributes.path : '',
            attributes.domain ? '; domain=' + attributes.domain : '',
            attributes.secure ? '; secure' : ''
        ].join('');
        document.cookie = sCookie;
    }
    static write(cookie, key, value, attributes) {
        if (Cookies.isDocumentExist) {
            // write
            if (arguments.length > 2) {
                attributes = Cookies.extend({ path: '/' }, cookie.defaults, attributes);
                Cookies.setExpireDate(attributes);
                let wobj = Cookies.formatToWrite(key, value);
                Cookies.writeToDocument(attributes, wobj);
            }
        }
    }
    static readCookie(oCookie) {
        let rdecode = /(%[0-9A-Z]{2})+/g;
        let parts = oCookie.split('=');
        let cookie = parts.slice(1).join('=');
        if (cookie.charAt(0) === '"') {
            cookie = cookie.slice(1, -1);
        }
        let result = {
            name: parts[0].replace(rdecode, decodeURIComponent),
            cookie: cookie.replace(rdecode, decodeURIComponent)
        }
        return result;
    }
    static read(cookie, key) {
        let result;
        // read
        if (!key) { result = {} }
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling "get()"
        let cookies = Cookies.documentCookies;
        for (let i = 0; i < cookies.length; i++) {
            let oCookie = Cookies.readCookie(cookies[i]);
            if (key === oCookie.name) {
                result = oCookie.cookie;
                break;
            }
            if (!key) { result[name] = oCookie.cookie; }
        }
        return result;
    }
}

const testCookie = () => {
    console.log('Test Cookies.');
    if (!nlib.cookies) nlib.cookies = new Cookies();
    let cookie1;
    console.log('Remove Cookies.');
    cookie1 = nlib.cookies.remove('key1');
    cookie1 = nlib.cookies.remove('key2');
    cookie1 = nlib.cookies.remove('key3');

    cookie1 = nlib.cookies.get('key1');
    //console.log('Read Cookies value : ', cookie1);
    nlib.cookies.set('key1', 'joe1', { expires: 1 });
    nlib.cookies.set('key2', 'joe2', { expires: 1 });
    nlib.cookies.set('key3', 'joe3', { expires: 1 });
    console.log('Test Write Cookies.');
    cookie1 = nlib.cookies.get('key1');
    console.log('Read Cookies value : ', cookie1);
    let json_cookies1 = nlib.cookies.getJSON();
    console.log('Read Cookies in json : ', json_cookies1);
}

(() =>{
    console.log('nlib initialized.');
    console.log('nlib version:', nlib.version);
    nlib.cookies = new Cookies(); // create new cookie.
    testCookie();
    console.log('nlib loaded.');
})();
