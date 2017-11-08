// var Thenjs = require('thenjs');
var dbbase = require('./db_base');

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
    var userinfo = socket.handshake.headers.referer.split('?')[1].split('&');
    var headPic = userinfo[0].split('=')[1];
    var userName = userinfo[1].split('=')[1];
    var userAddress = socket.handshake.address;

    var postyData = {
        CreatedTime: new Date().toLocaleString(),
        UserName: decodeURI(userName),
        HeadPicture: headPic,
        UserAddress: userAddress,
        UserAgent: JSON.stringify(socket.handshake.headers).split('user-agent":"')[1],
        Status: status
    };
    dbbase.query('insert into ChatUsers set ?', postyData, cb);
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