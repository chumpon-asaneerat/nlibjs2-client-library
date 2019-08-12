const path = require("path");
const nlib = require("./nlib/nlib");
const WebServer = require('./nlib/nlib-express');
const common = require('./routes/common')
const secure = require('./routes/secure')

const wsvr = new WebServer();
common(wsvr); // init commmon api routes
secure(wsvr); // init secure api routes

/** @type {WebServer.RequestHandler} */
let home = (req, res, next) => { WebServer.sendFile(req, res, 'index.html'); }

wsvr.get('/', home)

wsvr.listen();