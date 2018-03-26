var mysql = require('mysql');

var db_config = {
    "connectionLimit": 30,
    "host": "47.95.222.240",
    "port": "3306",
    "user": "root",
    "password": "123456",
    "database": "myweb"
}

var pools;

//使用数据库连接池
function mysqlPools() {
    if (pools == null) {
        pools = mysql.createPool(db_config);
    }

    var data = [];
    var callback = arguments[1];
    if (arguments.length == 3) {
        data = arguments[1];
        callback = arguments[2];
    }
    console.log('Print SQL:' + arguments[0] + JSON.stringify(data));
    pools.query(arguments[0], data, function(error, results, fields) {
        if (error) throw error;

        console.log('The solution is: ' + JSON.stringify(results));
        callback(error, results);
    });

}

//单个连接
function singleMysql() {
    var connection = mysql.createConnection(config.db_connections);
    connection.connect();
    var data = [];
    var callback = arguments[1];

    if (arguments.length == 3) {
        data = arguments[1];
        callback = arguments[2];
    }

    logger.info('Print SQL:' + arguments[0] + JSON.stringify(data));
    connection.query(arguments[0], data, function(error, results, fields) {

        connection.end();
        if (error) throw error;

        logger.info('The solution is: ' + JSON.stringify(results));

        callback(error, results);

    });

}

exports.query = mysqlPools;