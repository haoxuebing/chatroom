var express = require('express');
var app = express();

// 路径映射
app.get('/server', function(req, res) {
    res.sendFile(process.cwd() + '/views/server.html');
});

app.get('/*', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});



module.exports = app;