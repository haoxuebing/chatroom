// 引入必须模块
var http = require('http');
var app = require('./routes/routeRegister');
// var favicon = require('serve-favicon');
// var path = require('path');


// app.use(express.static(__dirname));
// app.use(favicon('favicon.ico'));
// app.set('views', path.join('views'));

// 路径映射
// router.get('/server', function(req, res) {
//     res.sendFile(__dirname + '/views/server.html');
// });

// router.get('/*', function(req, res) {
//     res.sendFile(__dirname + '/views/index.html');
// });


// app.use('/', router);

var port = 4000;
// app.set('port', port);

var server = http.createServer(app);
server.listen(port);

server.on('error', function(error) {
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function() {
    console.log('Sever is running');
});

var socket = require('./modules/socket');
socket.listen(server);