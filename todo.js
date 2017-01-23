var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res) {
    switch(req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                item += chunk;
            });
            req.on('end', function() {
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            var body = items.map(function(item, i) {
                return i + ') ' + item;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain;charset="utf8"');
            res.end(body);
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);
            
            if(isNaN(i)) { // 檢查數字是否有效
                res.statusCode = 400;
                res.end('Invalid item id');
            }
            else if(!items[i]) { // 確保請求的索引存在
                res.statusCode = 404;
                res.end('Item not found');
            }
            else // 刪除請求的事項
            {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;

    }
});

server.listen(3000);