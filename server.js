//const path = require("path");
//const nlib = require("./nlib/nlib");
const WebServer = require('./nlib/nlib-express');

const wsvr = new WebServer();
wsvr.listen();