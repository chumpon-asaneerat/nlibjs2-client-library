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

const createSessionKey = (req, res, next) => {
    let name = 'x-device';
    let cookie = new WebServer.cookie(req, res, name);    
    let deviceId = cookie.get();
    if (!deviceId) {
        deviceId = '12345';
        cookie.set(deviceId);
    }
    next();
}

wsvr.get('/', createSessionKey, routes.home)
wsvr.get("/getJson", createSessionKey, routes.getJson);
wsvr.get("/getJavaScript", createSessionKey, routes.getJavaScript);
wsvr.post("/postJson", createSessionKey, routes.postJson);
wsvr.post('/uploadmultiple', createSessionKey, WebServer.uploadfiles);

wsvr.listen();
