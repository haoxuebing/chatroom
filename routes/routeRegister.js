var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
// var bodyParser = require('body-parser');

app.use(express.static(process.cwd()));
app.use(favicon('favicon.ico'));

// view engine setup
app.set('views', path.join('views'));
app.set('view engine', 'ejs');

// app.use(require('body-parser').urlencoded({
//     extended: true
// }));
app.use(require('cookie-parser')());
app.use(session({
    secret: 'secret', //secret值可以任意，但不能为空
    name: 'user_session', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 60 * 60 * 1000
    }, //设置maxAge是60分钟，即60分钟后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

// app.use(favicon(path.join('public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(path.join('public')));

var index = require('./index');
app.use('/', index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;