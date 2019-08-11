const path = require("path");
//const nlib = require("./nlib/nlib");
const WebServer = require('./nlib/nlib-express');
let wsvr = new WebServer();

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
    }
}

let users = [];
let devices = [];

const userRoutes = {
    /** @type {WebServer.RequestHandler} */
    userinfo: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    register: (req, res, next) => {
        let user = {
            username: req.body.username,
            password: req.body.password
        }
        let data = { status: 'success' }
        users.push(user)
        console.log(users);
        wsvr.sendJson(req, res, data);
    },
    /** @type {WebServer.RequestHandler} */
    signin: (req, res, next) => {},
    /** @type {WebServer.RequestHandler} */
    signout: (req, res, next) => {}
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
wsvr.get("/getJson", createSessionKey, routes.getJson);
wsvr.get("/getJavaScript", createSessionKey, routes.getJavaScript);
wsvr.post("/postJson", createSessionKey, routes.postJson);
wsvr.post('/uploadmultiple', createSessionKey, WebServer.uploadfiles);

wsvr.post("/users/register", userRoutes.register);

wsvr.listen();
