//#region common requires

const path = require("path");
const fs = require('fs');

//#endregion

//#region Express and middlewares (require)

const express = require("express");

const morgan = require("morgan");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const favicon = require("serve-favicon");
const formidable = require('formidable');

//#endregion

//#region Express and middlewares (setup)

const app = express()

app.use(helmet());
app.use(morgan("dev"));

app.use(cookieparser("YOUR_SECURE_KEY@123"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const iconpath = path.join(__dirname, "public", "favicon.ico");
app.use(favicon(iconpath));

//#endregion

//#region sample middlewares
/*
let simplelogger = (req, res, next) => {
    console.log('LOGGED')
    next()
}

let jsonassign = (req, res, next) => {
    console.log('JSON Assigned')
    req.document = {
        value: 'creeate from jsonassign'
    }
    next()
}
*/
//#endregion

//#region Setup public paths

const publicPath = path.join(__dirname, 'public');
const publicMaxAge = { maxage: '30d' };
app.use('/public', express.static(publicPath, publicMaxAge));

//#endregion

//#region Setup dist path (Third party libraries)

const distPath = path.join(__dirname, 'public', 'dist');
const distMaxAge = { maxage: '60s' };
const dist_libs = [
    /* jQuery */
    { "route": "/dist/js", "path": "jquery-3.3.1" },
    /* jQuery UI */
    { "route": "/dist/css", "path": "jquery-ui-1.12.1" },
    { "route": "/dist/js", "path": "jquery-ui-1.12.1" },
    /* bootstrap 4.x */
    { "route": "/dist/js", "path": "popperjs-1.15.0" },
    { "route": "/dist/js", "path": "tooltipjs-1.3.2" },
    { "route": "/dist", "path": "bootstrap-4.2.1" },
    /* font-awesome 5.x */
    { "route": "/dist", "path": "font-awesome-5.9.0" },
    /* emoji-symbols */
    { "route": "/dist/css", "path": "emoji-symbols-1.0.0" },
    /* flag-icon-css 3.x */
    { "route": "/dist", "path": "flag-icon-css-3.1.0" },
    /* animate-css */
    { "route": "/dist", "path": "animate-css-3.7.2" },
    /* moment */
    { "route": "/dist/js", "path": "moment-2.24.0" },
    /* chartjs */
    { "route": "/dist", "path": "chart-js-2.8.0" },
    /* chartjs-plugin-datalabels */
    { "route": "/dist", "path": "chart-js-plugin-datalabels-0.6.0" },
    /* chartjs-plugin-piechart-outlabels */
    { "route": "/dist", "path": "chart-js-plugin-piechart-outlabels-0.1.4" },
    /* howler */
    { "route": "/dist/js", "path": "howler-2.1.2" },
    /* jquery-org-chart */
    { "route": "/dist", "path": "jquery-org-chart-2.1.3" },
    /* tabulator */
    { "route": "/dist", "path": "tabulator-4.3.0" },
    /* ace */
    { "route": "/dist/js", "path": "ace-1.4.5" },
    /* simplebar */
    { "route": "/dist", "path": "simplebar-4.1.0" },
    /* overlay-scrollbar */
    { "route": "/dist", "path": "overlay-scrollbars-1.9.1" },
    /* reveal.js */
    //{ "route": "/dist", "path": "reveal-3.8.0" },
    /* riotjs */
    { "route": "/dist/js", "path": "riotjs-3.13.2" },
    /* for access precompile riotjs component */
    { "route": "/components", "path": "../../dist/component/riot" },
    /* for access src nlib.js */
    { "route": "/dist/js", "path": "../../src/client/js" },
    /* for test nlib.js */
    { "route": "/dist/js", "path": "../../src/client/test" }
];

function dist_lib(app, exportRoute, localPath) {
    console.log('publish "' + localPath + '"');
    app.use(exportRoute, express.static(path.join(distPath, localPath), distMaxAge));
};

// dist paths.
dist_libs.forEach(element => {
    dist_lib(app, element.route, element.path);
});

//#endregion

//#region Express Utils functions

const sendJson = (req, res, data) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.write(JSON.stringify(data, null, 4,));
    res.end();    
};

//#endregion

//#region Express routes

//#region home and index.html

app.get("/", (req, res) => {
    res.status(200).send(`It's work!!!`);
});

app.get("/:file", (req, res, next) => {
    if (req.params.file === 'index.html') {
        res.sendFile(path.join(__dirname, req.params.file));
    }
    else {
        next();
    }
});

//#endregion

//#region Upload with formidable

app.post('/uploadmultiple', function (req, res){
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';

    // Limits the amount of memory all fields together (except files) can allocate in bytes.
    // If this value is exceeded, an 'error' event is emitted. The default size is 20MB.
    form.maxFieldsSize = 20 * 1024 * 1024; // used default.

    // Limits the size of uploaded file. If this value is exceeded, an 'error' event is emitted. 
    // The default size is 200MB.
    form.maxFileSize = 5 * 1024 * 1024 * 1024; // exntend to 5GB.

    // Limits the number of fields that the querystring parser will decode.
    // Defaults to 1000 (0 for unlimited).
    form.maxFields = 1000; // used default.

    // If this option is enabled, when you call form.parse, the files argument will contain 
    // arrays of files for inputs which submit multiple files using the HTML5 multiple attribute.
    form.multiples = true;

    form.parse(req);
    form.on('progress', (bytesReceived, bytesExpected) => {
        //let percent_complete = (bytesReceived / bytesExpected) * 100;
        //console.log(percent_complete.toFixed(2));
        // required socket.io to emit event back to client.
    })
    form.on('field', (name, field) => { console.log('Field', name, field) })
    form.on('fileBegin', (name, file) => {
        let dest = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        file.path = path.join(dest, file.name);
    })
    form.on('file', (name, file) => { console.log('Uploaded ' + file.name); })
    form.on('aborted', () => { console.error('Request aborted by the user') })
    form.on('error', (err) => {
        console.error('Error', err)
        throw err
    })
    form.on('end', () => { 
        res.end()        
    })
    //res.sendFile(path.join(__dirname, 'index.html'));
});

//#endregion

//#region get/post test (json, js, image, audio, video) routes

app.get("/getJson", (req, res) => {
    let data = {
        name: 'joe',
        value: Date.now()
    }
    sendJson(req, res, data);
});

app.get("/getJavaScript", (req, res) => {
    res.sendFile(path.join(__dirname, 'server.js'))
});

app.post("/postJson", (req, res) => {
    let data = { result: 'success' }
    sendJson(req, res, data);
});

//#endregion

//#endregion

//#region Test middleware route chain

app.get("/chain", 
    // loging
    (req, res, next) => {
        console.log('1. LOGGED')
        next()
    },
    // assigned json
    (req, res, next) => {
        console.log('2. json assigned')
        req.document = {
            value: 'creeate from jsonassign'
        }
        next()
    },
    (req, res, next) => {
        console.log('3. check condition')
        if (req.query['status'] === 'true') {
            console.log('3.1. status OK.')
            next()
        }
        else {
            console.log('3.2. no status match')
            //next('route') // skip all routes show 404 error.
            //res.redirect('/index.html') // redirect.
            res.status(200).send('no status assigned');
        }
    },
    (req, res, next) => {
        console.log('4. before end of chain')
        req.document.value = req.document.value + ' modified by joe'
        next()
    },
    (req, res, next) => {
        console.log('5. final route')
        res.status(200).send(`It's work!!! valuee: ${req.document.value}`);
    }
);

//#endregion

//#region Express server start

const info = { PORTNO: 3000, APPNAME: 'NLib Client test server'}

app.listen(info.PORTNO, () => {
    console.log(`${info.APPNAME} start at port ${info.PORTNO}`)
})

//#endregion