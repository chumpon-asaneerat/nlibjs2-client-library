const WebServer = require('./../../../nlib/nlib-express');
const WebRouter = WebServer.WebRouter;
const router = new WebRouter();

const checkSecure = (req, res, next) => {
    console.log('secure checked.');
    next();
}

const checkSecure2 = (req, res, next) => {
    console.log('secure level 2 checked.');
    next();
}

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

router.use(checkSecure);
router.get('/api2', routes.api2)
router.get('/api3', checkSecure2, routes.api3)

/**
 * Init routes.
 * 
 * @param {express} app 
 */
function init_routes(svr) {
    svr.route('/api', router);
};

module.exports.init_routes = exports.init_routes = init_routes;