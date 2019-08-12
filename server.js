const path = require("path");
const nlib = require("./nlib/nlib");
const WebServer = require('./nlib/nlib-express');
const WebRouter = WebServer.WebRouter;

const wsvr = new WebServer();

const commonRoute = new WebRouter();
const secureRoute = new WebRouter();

let checkSecure = (req, res, next) => {
    console.log('secure checked.');
    next();
}

let checkSecure2 = (req, res, next) => {
    console.log('secure level 2 checked.');
    next();
}

const routes = {
    /** @type {WebServer.RequestHandler} */
    home: (req, res, next) => {
        WebServer.sendFile(req, res, 'index.html');
    },
    /** @type {WebServer.RequestHandler} */
    api1: (req, res, next) => {
        let data = { message: 'The api 1' }
        WebServer.sendJson(req, res, data);
    },
    /** @type {WebServer.RequestHandler} */
    api2: (req, res, next) => {
        let data = { message: 'The api 2 (secure)' }
        WebServer.sendJson(req, res, data);
    },
    /** @type {WebServer.RequestHandler} */
    api3: (req, res, next) => {
        let data = { message: 'The api 3 (secure)' }
        WebServer.sendJson(req, res, data);
    }
}

commonRoute.get('/api1', routes.api1)

secureRoute.use(checkSecure); // all route check will the secure.
secureRoute.get('/api2', routes.api2) // default secure
secureRoute.get('/api3', checkSecure2, routes.api3) // default secure and custom secure

wsvr.get('/', routes.home)
// setup router(s).
wsvr.route('/api', commonRoute);
wsvr.route('/api', secureRoute);

wsvr.listen();