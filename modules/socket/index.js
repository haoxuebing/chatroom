var socketio = require('socket.io');
var io;
var querystring = require('querystring');
var db_http = require('../dbService/db_http');

//在线用户
var onlineUsers = [];

exports.listen = function(server) {

    io = socketio.listen(server);
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
                onlineUsers.delUser(user);

                // 发送给客户端断在线人数
                io.emit('disconnected', onlineUsers);
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

    Array.prototype.delUser = function(_obj) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            if (this[i].id == _obj.id) {
                if (i == 0) {
                    this.shift(); //删除并返回数组的第一个元素
                    return;
                } else if (i == length - 1) {
                    this.pop(); //删除并返回数组的最后一个元素
                    return;
                } else {
                    this.splice(i, 1); //删除下标为i的元素
                    return;
                }
            }
        }
    };
}