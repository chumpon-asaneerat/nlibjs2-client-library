//#region common requires

const path = require('path');
const rootPath = process.env['ROOT_PATHS'];

// for production
const nlibPath = path.join(rootPath, 'nlib');
// for nlib-server dev project
//const nlibPath = path.join(rootPath, 'src', 'server', 'js', 'nlib');
const nlibjs = path.join(nlibPath, 'nlib');
const nlib = require(nlibjs);

const nlibExprjs = path.join(nlibPath, 'nlib-express');

const WebServer = require(nlibExprjs);

//#endregion

//#region router type and variables

const WebRouter = WebServer.WebRouter;
const router = new WebRouter();

//#endregion

const routes = class {
    /**
     * api2
     * @param {Request} req The Request.
     * @param {Response} res The Response.
     * @param {WebServer.RequestHandler} next The RequestHandler.
     */
    static api2(req, res, next) {
        let data = { message: 'The api 2 (secure)' }
        WebServer.sendJson(req, res, data);
    }
    /**
     * api3
     * @param {Request} req The Request.
     * @param {Response} res The Response.
     * @param {WebServer.RequestHandler} next The RequestHandler.
     */
    static api3(req, res, next) {
        let data = { message: 'The api 3 (super secure)' }
        WebServer.sendJson(req, res, data);
    }
}

const checkSecure = (req, res, next) => {
    console.log('secure checked.');
    next();
}

const checkSecure2 = (req, res, next) => {
    console.log('secure level 2 checked.');
    next();
}

router.use(checkSecure);
router.get('/api2', routes.api2)
router.get('/api3', checkSecure2, routes.api3)

const init_routes = (svr) => {
    svr.route('/api', router);
};

module.exports.init_routes = exports.init_routes = init_routes;
