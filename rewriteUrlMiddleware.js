var connect = require('connect');
var url = require('url');
var app = connect()
    .use(rewrite)
    .use(showPost)
    .listen(3000);

var path = url.parse(req.url).pathname;

function rewrite(req, res, next) {
    var match = path.match(/^\/blog\/posts\/(.+)/);
    // 只針對/blog/posts請求執行查找
    if(match) {
        findPostIdBySlug(match[1], function(err, id) {
            // 如果查找出錯，則通知錯誤處理器並停止處理
            if(err) return next(err);
            // 如果沒找到跟縮略名相對應的ID，則帶著"User not found"的錯誤參數調用next()
            if(!id) return next(new Error('User not found'));
            // 重寫req.url屬性，以便後續中間件可以使用真實的ID
            req.url = '/blog/posts/' + id;
            next();
        });
    }
    else
    {
        next();
    }
}