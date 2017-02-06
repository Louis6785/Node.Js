var connect = require('connect');
// 路由器組件
var router = require('./middleware/router');
// 定義路由的對象
var routes = {
    GET: {
        '/users': function(req, res) {
            res.end('tobi, loki, ferret');
        },
        '/user/:id': function(req, res, id) {   // 其中每一項都是對請求URL的映射，並包含要調用的回調函數
            res.end('user ' + id);
        }
    },
    DELETE: {
        '/user/:id': function(req, res, id) {
            res.end('deleted user ' + id);
        }
    }
};

connect()
    .use(router(routes))    // 將路由對象傳給路由器的setup函數
    .listen(3000);

// 多路由器管理
// connect()
//     .use(router(require('./routes/user')))
//     .use(router(require('./routes/admin')))
//     .listen(3000);