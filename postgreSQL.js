var pg = require('pg');
var conString = "tcp://myuser:mypassword@localhost:5432/mydatabase";

// 連接postgreSQL
var client = new pg.Client(conString);
client.connect();

// 插入一筆記錄
client.query(
    'INSERT INTO users' +
    "(name) VALUES('Mike')"
);

// 插入一筆記錄(使用參數)
client.query(
    'INSERT INTO users' +
    "(name, age) VALUES($1, $2)",
    ['Mike', 39]
);

// 插入一筆記錄(使用參數並回傳值)
client.query(
    'INSERT INTO users' +
    "(name, age) VALUES($1, $2) " +
    "RETURNING id",
    ['Mike', 39],
    function(err, result) {
        if(err) throw err;
        console.log('Insert ID is ' + result.rows[0].id);
    }
);

// 創建返回結果的查詢
var query = client.query(
    'SELECT * FROM users WHERE age > $1',
    [40]
);

// 處理返回的紀錄
query.on('row', function(row) {
    console.log(row.name);
});

// 查詢完成後的處理
query.on('end', function() {
    client.end();
});