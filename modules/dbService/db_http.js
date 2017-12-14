// var Thenjs = require('thenjs');
var Client = require('node-rest-client').Client;
var client = new Client();
const whois = 'http://whois.pconline.com.cn/ip.jsp?ip=';
var iconv = require('iconv-lite');
var dbbase = require('./db_base');
var querystring = require('querystring');

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

function InsertChatUser(userinfo, status, cb) {
    userinfo.Status = status;
    userinfo.UserMobile = 1;
    userinfo.CreatedTime = new Date().toLocaleString();
    dbbase.query('insert into ChatUsers set ?', userinfo, cb);

}

function InsertMessage(message, cb) {

    var postyData = {
        CreatedTime: message.createdTime, //new Date().toLocaleString(),
        UserName: message.name,
        Message: message.chatContent,
        HeadPicture: message.img
    };
    dbbase.query('insert into ChatMessage set ?', postyData, cb);
}

function InsertOnlineUser(user, cb) {
    user.CreatedTime = new Date().toLocaleString();
    dbbase.query('insert into OnlineUsers set ?', user, cb);
}

function DelOnlineUser(sessionId, cb) {
    dbbase.query('DELETE FROM OnlineUsers WHERE SessionId= ?', sessionId, cb);
}


function CheckUserName(req, cb) {
    dbbase.query(' SELECT COUNT(*) as Num FROM OnlineUsers WHERE UserName= ?', req.query.username, cb);
}

function GetNewMsgs(cb) {
    dbbase.query('SELECT UserName AS `name`,Message AS chatContent,HeadPicture AS img,CreatedTime as createdTime FROM ChatMessage ORDER BY Id DESC LIMIT 5;', cb);
}

module.exports = {
    InsertHttp,
    InsertChatUser,
    InsertMessage,
    CheckUserName,
    InsertOnlineUser,
    DelOnlineUser,
    GetNewMsgs
}