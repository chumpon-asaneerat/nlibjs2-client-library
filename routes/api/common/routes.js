const WebServer = require('./../../../nlib/nlib-express');
const WebRouter = WebServer.WebRouter;

const router = new WebRouter();

const routes = class {
    /**
     * api1
     * @param {Request} req The Request.
     * @param {Response} res The Response.
     * @param {WebServer.RequestHandler} next The RequestHandler.
     */
    static api1(req, res, next) {
        let data = { message: 'The api 1' }
        WebServer.sendJson(req, res, data);
    }
}

router.get('/api1', routes.api1)

/**
 * Init routes.
 * 
 * @param {express} svr 
 */
function init_routes(svr) {
    svr.route('/api', router);
};

module.exports.init_routes = exports.init_routes = init_routes;