var express = require('express');
var app = express();
var db_http = require('../modules/dbService/db_http');

// 路径映射

app.get('/server', function(req, res) {
    db_http.CheckUserName(req, function(err, rlt) {
        if (rlt[0] && rlt[0].Num > 0) {
            res.render('index', {
                errorMsg: '用户名重复'
            });
        } else
            res.sendFile(process.cwd() + '/views/server.html');
    })
});

app.get('/*', function(req, res) {
    res.render('index', {
        errorMsg: ''
    });
    //res.sendFile(process.cwd() + '/views/index.html');
});



module.exports = app;