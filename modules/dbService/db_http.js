// var Thenjs = require('thenjs');
var Client = require('node-rest-client').Client;
var client = new Client();
var iconv = require('iconv-lite');
var dbbase = require('./db_base');
var querystring = require('querystring');
const whois = 'http://whois.pconline.com.cn/ip.jsp?ip=';

function InsertHttp(req, res, cb) {
    var postyData = {
        CreatedTime: new Date().toLocaleString(),
        UserName: 'Hello World',
        SessionId: req.sessionID,
        PathName: req.url,
        QueryData: JSON.stringify(req.query),
        BodyData: JSON.stringify(req.body),
        UserAgent: JSON.stringify(req.headers).split('user-agent":"')[1],
        UserAddress: req.connection.remoteAddress
    };
    dbbase.query('insert into HttpPreview set ?', postyData, cb);
}

function InsertSocket(socket, status, cb) {
    var userinfo = querystring.parse(socket.handshake.headers.referer.split('?')[1]);
    var headPic = userinfo.selectpicture;
    var userName = userinfo.username;
    var userMobile = userinfo.usermobile || '1';
    var userIP = socket.handshake.headers['x-real-ip'] || userinfo.remoteIP || socket.handshake.address; //socket.handshake.address; //socket.client.conn.remoteAddress;
    console.log(socket.handshake.headers['x-real-ip'] + '||' + socket.client.conn.remoteAddress + '\n');

    client.get(whois + userIP, function(data) {
        var userAddress = iconv.decode(data, 'gbk').replace(/(^\s*)|(\s*$)/g, "") || '未知地址';
        var postyData = {
            CreatedTime: new Date().toLocaleString(),
            UserName: decodeURI(userName),
            UserMobile: userMobile,
            HeadPicture: headPic,
            UserIP: userIP,
            UserAddress: userAddress,
            UserAgent: socket.handshake.headers['user-agent'],
            Status: status
        };
        dbbase.query('insert into ChatUsers set ?', postyData, cb);
    })



}

function InsertMessage(message, cb) {

    var postyData = {
        CreatedTime: new Date().toLocaleString(),
        UserName: message.name,
        Message: message.chatContent
    };
    dbbase.query('insert into ChatMessage set ?', postyData, cb);
}

module.exports = {
    InsertHttp: InsertHttp,
    InsertSocket: InsertSocket,
    InsertMessage: InsertMessage
}