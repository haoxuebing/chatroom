// 引入必须模块
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var querystring = require('querystring')
var db_http = require('./modules/dbService/db_http');

// 在线人数统计
var onlineCount = 0;
//在线用户
var onlineUsers = [];

app.use(express.static(__dirname));

// 路径映射
app.get('/login.html', function(request, response) {
    response.sendFile('index.html');
});

app.get('/server.html', function(request, response) {
    response.sendFile('server.html');
});

// 当有用户连接进来时
io.on('connection', function(socket) {


    db_http.InsertSocket(socket, 1, function(err, rlt) {
        console.log('a user connected');



        var query = querystring.parse(socket.handshake.headers.referer);

        var user = {
            id: socket.id,
            userName: query.username
        }
        onlineUsers.push(user);

        // 发送给客户端在线人数
        io.emit('connected', onlineUsers);
    });


    // 当有用户断开
    socket.on('disconnect', function() {

        db_http.InsertSocket(socket, 0, function(err, rlt) {
            console.log('user disconnected');

            var query = querystring.parse(socket.handshake.headers.referer);
            var user = {
                id: socket.id,
                userName: query.username
            }
            onlineUsers.shift(onlineUsers.myIndexOf(user), 1);

            // 发送给客户端断在线人数
            io.emit('disconnected', onlineUsers);
            console.log(onlineCount);
        });

    });

    // 收到了客户端发来的消息
    socket.on('message', function(message) {
        // 给客户端发送消息
        db_http.InsertMessage(message, function(err, rlt) {
            console.log(JSON.stringify(message));
            io.emit('message', message);
        })
    });

});

Array.prototype.myIndexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id == val.id) return i;
    }
    return -1;
};

var server = http.listen(4000, function() {
    console.log('Sever is running');
});