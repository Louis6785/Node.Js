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

connect()
    .use(logger)
    .use(hello)
    .listen(3000);