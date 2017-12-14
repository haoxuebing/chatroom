var socketio = require('socket.io');
var io;
var querystring = require('querystring');
var Thenjs = require('thenjs');
var db_http = require('../dbService/db_http');
var Client = require('node-rest-client').Client;
var client = new Client();
var iconv = require('iconv-lite');
const whois = 'http://whois.pconline.com.cn/ip.jsp?ip=';

//在线用户
var onlineUsers = [];

exports.listen = function(server) {

    io = socketio.listen(server);

    // 当有用户连接进来时
    io.on('connection', function(socket) {

        var userIP = socket.handshake.headers['x-real-ip'] || socket.client.conn.remoteAddress || socket.handshake.address;

        client.get(whois + userIP, function(obj) {
            var userAddress = iconv.decode(obj, 'gbk').replace(/(^\s*)|(\s*$)/g, "") || '未知地址';
            var query = querystring.parse(socket.handshake.headers.referer.split('?')[1]);
            var user = {
                id: socket.id,
                userName: query.username,
                userAddress: userAddress
            }
            var userinfo = {
                SessionId: socket.id,
                UserName: decodeURI(query.username),
                HeadPicture: query.selectpicture,
                UserIP: userIP,
                UserAddress: userAddress,
                UserAgent: socket.handshake.headers['user-agent']
            }


            Thenjs.parallel([
                cont => db_http.InsertOnlineUser(deepCoyp(userinfo), cont),
                cont => db_http.InsertChatUser(deepCoyp(userinfo), 1, cont)
            ]).then((cont, rlt) => {
                console.log('a user connected');
                onlineUsers.push(user);
                io.emit('connected', onlineUsers); // 发送给客户端在线人数
                db_http.GetNewMsgs(cont);
            }).then((cont, rlt) => {
                //查询最新五条消息推过去
                io.emit('messages', rlt);
            })


            // 当有用户断开
            socket.on('disconnect', function() {
                Thenjs.parallel([
                    cont => db_http.DelOnlineUser(socket.id, cont),
                    cont => db_http.InsertChatUser(deepCoyp(userinfo), 0, cont)
                ]).then((cont, rlt) => {
                    onlineUsers.delUser(user);
                    io.emit('disconnected', onlineUsers); // 发送给客户端断在线人数
                    console.log('user disconnected');
                })
            });

        })

        // 收到了客户端发来的消息
        socket.on('message', function(message) {
            // 给客户端发送消息
            message.createdTime = new Date().toLocaleString();
            db_http.InsertMessage(message, function(err, rlt) {
                console.log(JSON.stringify(message));
                io.emit('message', message);
            })
        });


    });


    function deepCoyp(source) {
        var result = {};
        for (var key in source) {
            result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
        }
        return result;
    };

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