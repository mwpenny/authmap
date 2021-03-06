var express = require('express');
var path = require('path');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if (!err.status) {
        err.message = 'Internal Server Error';
        err.status = 500;
    }
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = app;
