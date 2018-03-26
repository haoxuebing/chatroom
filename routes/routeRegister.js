var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var Then = require('thenjs');
var Client = require('node-rest-client').Client;
var client = new Client();
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
var http = require("http");

//process.cwd()
app.use(express.static(path.join('public')));
app.use(favicon('favicon.ico'));

// view engine setup
app.set('views', path.join('views'));
app.set('view engine', 'ejs');

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

var index = require('./index');
app.use('/', function(req, res, next) {
    // var ip = req.headers['x-real-ip'] + '||' + req.connection.remoteAddress;
    // var url = 'http://whois.pconline.com.cn/ip.jsp?ip=' + ip;
    // client.get(url, function(data) {
    //     var strJson = iconv.decode(data, 'gbk').replace(/(^\s*)|(\s*$)/g, "");
    //     console.log(ip + '||' + strJson);
    // })
    next();

    // http.get(url, function(res) {
    //     // var arrBuf = [];
    //     // var bufLength = 0;
    //     var bufferHelper = new BufferHelper();
    //     res.on("data", function(chunk) {
    //         // arrBuf.push(chunk);
    //         // bufLength += chunk.length;
    //         bufferHelper.concat(chunk);
    //     });
    //     res.on("end", function() {
    //         // arrBuf是个存byte数据块的数组，byte数据块可以转为字符串，数组可不行
    //         // bufferhelper也就是替你计算了bufLength而已 
    //         // var chunkAll = Buffer.concat(arrBuf, bufLength);
    //         // var strJson = iconv.decode(chunkAll, 'gbk'); // 汉字不乱码
    //         var strJson = iconv.decode(bufferHelper.toBuffer(), 'gbk');
    //         console.log(strJson);
    //         next();
    //     });
    // })

}, index);

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