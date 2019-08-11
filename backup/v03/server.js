const path = require("path");
//const nlib = require("./nlib/nlib");
const WebServer = require('./nlib/nlib-express');

const wsvr = new WebServer();
const userSvr = require('./userservice');

const TestDb7x3 = require('./TestDb7x3.db');
const db = new TestDb7x3();

const routes = {
    /** @type {WebServer.RequestHandler} */
    home: (req, res, next) => {
        res.sendFile(__dirname + '/index.html')
    },
    getJson: (req, res, next) => {
        let data = {
            name: 'joe',
            value: Date.now()
        }
        wsvr.sendJson(req, res, data);
    },
    getJavaScript: (req, res, next) => {
        res.sendFile(path.join(__dirname, 'server.js'))
    },
    postJson: (req, res, next) => {
        let data = { result: 'success' }
        wsvr.sendJson(req, res, data);
    },
     /** @type {WebServer.RequestHandler} */
    randomCode: (req, res, next) => {
        (async() => {
            let connected = await db.connect();
            if (connected) {
                let data = await db.GetRandomHexCode({ length: 3 });
                await db.disconnect();
                wsvr.sendJson(req, res, data);
            }
            else {
                wsvr.sendJson(req, res, { error: 'cannot connect to database server.' });
            }
        })()
    }

}

let devices = [];

const userRoutes = {
    /** @type {WebServer.RequestHandler} */
    userinfo: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    register: (req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        // simulate call async function for execute sql server stored procedure.
        (async() => {
            let data = await userSvr.registerAsync(username, password);
            wsvr.sendJson(req, res, data);
        })();
    },
    /** @type {WebServer.RequestHandler} */
    signin: (req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        let data = userSvr.signIn(username, password);
        wsvr.sendJson(req, res, data);
    },
    /** @type {WebServer.RequestHandler} */
    signout: (req, res, next) => {
        let tokenId = req.body.tokenId;
        let data = userSvr.signOut(tokenId);
        wsvr.sendJson(req, res, data);
    }
}

const deviceRoutes = {
    /** @type {WebServer.RequestHandler} */
    deviceinfo: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    register: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    signin: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    signout: (req, res, next) => {}
}

const createSessionKey = (req, res, next) => {
    let expires = WebServer.expires;

    let nname = 'x-device';
    let ncookie = new WebServer.cookie(req, res, nname);
    let ndeviceId = ncookie.get();
    if (!ndeviceId) {
        ndeviceId = '12345';
        ncookie.set(ndeviceId, expires.in(15).seconds);
    }

    let sname = 's-device';
    let scookie = new WebServer.signedCookie(req, res, sname);
    let sdeviceId = scookie.get();
    if (!sdeviceId) {
        sdeviceId = '12345';
        scookie.set(sdeviceId, expires.in(15).seconds);
    }

    let sname2 = 's-name';
    let scookie2 = new WebServer.signedCookie(req, res, sname2);
    let sdeviceId2 = scookie2.get();
    if (!sdeviceId2) {
        sdeviceId2 = '12345';
        scookie2.set(sdeviceId2, expires.in(15).seconds);
    }

    next();
}

wsvr.get('/', createSessionKey, routes.home)
wsvr.get('/getJson', createSessionKey, routes.getJson);
wsvr.get('/randomcode', createSessionKey, routes.randomCode);
wsvr.get('/getJavaScript', createSessionKey, routes.getJavaScript);
wsvr.post('/postJson', createSessionKey, routes.postJson);
wsvr.post('/uploadmultiple', createSessionKey, WebServer.uploadfiles);

wsvr.post('/users/register', userRoutes.register);
wsvr.post('/users/signin', userRoutes.signin);
wsvr.post('/users/signout', userRoutes.signout);

wsvr.listen();
