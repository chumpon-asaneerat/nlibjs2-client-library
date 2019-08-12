const WebServer = require('./../../../../nlib/nlib-express');
const WebRouter = WebServer.WebRouter;
const router = new WebRouter();

const routes = class {
    /**
     * home
     * @param {Request} req The Request.
     * @param {Response} res The Response.
     * @param {WebServer.RequestHandler} next The RequestHandler.
     */
    static home(req, res, next) {
        WebServer.sendFile(req, res, 'index.html');
    }
}

router.get('/', routes.home)

/**
 * Init routes.
 * 
 * @param {express} app 
 */
function init_routes(svr) {
    svr.route('/', router);
};

module.exports.init_routes = exports.init_routes = init_routes;