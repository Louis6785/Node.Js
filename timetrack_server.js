var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');   // 引入MySQL API

// 連接MySQL
var db = mysql.createConnection({
    host: "127.0.0.1",
    user: 'myuser',
    password: 'mypassword',
    database: 'timetrack'
});

// HTTP請求路由
var server = http.createServer(function(req, res) {
    switch(req.method) {
        // HTTP POST請求路由
        case 'POST':
            switch(req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
            }
            break;
        // HTTP GET請求路由
        case 'GET':
            switch(req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
                    break;                
            }
            break;
    }    
});

// 創建數據庫表
db.query(
    // 建表SQL
    "CREATE TABLE IF NOT EXISTS work("
    + "id INT(10) NOT NULL AUTO_INCREMENT,"
    + "hours DECIMAL(5,2) DEFAULT 0,"
    + "date DATE,"
    + "archived INT(1) DEFAULT 0,"
    + "description LONGTEXT,"
    + "PRIMARY KEY(id))",
    function(err) {
        if(err) throw err;
        console.log('Server started...');
        // 啟動HTTP服務器
        server.listen(3000, '127.0.0.1');
    }
);