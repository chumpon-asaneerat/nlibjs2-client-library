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
    },
}

wsvr.get('/', routes.home)
wsvr.get("/getJson", routes.getJson);
wsvr.get("/getJavaScript", routes.getJavaScript);
wsvr.post("/postJson", routes.postJson);

wsvr.listen();
