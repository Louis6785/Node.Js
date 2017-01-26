var connect = require('connect');

// 輸出HTTP請求的方法和URL並調用next()
function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

// 用"hello world"响應HTTP請求
function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

function authenticateWithDatabase(user, pass, callback) {
  var err;
  if (user != 'tobi' || pass != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}

// 實現HTTP Basic認證的中間件組件
function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    if(!authorization) return next(new Error('Unauthorized'));

    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    // 根據數據庫中的記錄檢查認證信息的函數
    authenticateWithDatabase(user, pass, function(err) {
        // 告訴分派器出錯了
        if(err) return next(err);
        // 如果認證信息有效，不帶參數調用next()
        next();
    });
}

// 路由admin請求
function admin(req, res, next) {
    switch(req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi','loki','jane']));
            break;
    }
}

connect()
    .use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);