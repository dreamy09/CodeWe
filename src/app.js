/**
 * App
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 */

const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const minify = require('express-minify');
const logger = require('morgan');
const compression = require('compression');
let debug = require('debug');
const index = require('./routes/index');
const editor = require('./routes/editor');
const legal = require('./routes/legal');
const config = require('./config/config');
const promBundle = require("express-prom-bundle");

const app = express();
app.disable("x-powered-by");

// Configure views folder
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

// Adding middleware
// TODO change logger for production mode
app.use(logger('dev'));
app.use(compression());
app.use(minify());

// Prometheus
if(config.METRICS){
    app.use(promBundle({
        includeMethod: true,
        includePath: true,
    }));
}

//app.use(lessMiddleware(path.join(__dirname, 'publics/css'), { compress: true, debug: config.DEBUG }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Set static folder
app.use(express.static(path.join(__dirname, 'publics/')));

// Configure routes
app.use('/', index);
app.use('/editor', editor);
app.use('/legal', legal);


// 404 error
app.all('*', (req, res) => {
    res.status(404).render('404.html', {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

// Handle errors
app.use((error, req, res, next) => {
    debug(error);
    res.sendStatus(500);
});

module.exports = app;
