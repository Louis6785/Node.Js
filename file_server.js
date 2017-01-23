var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;
var server = http.createServer(function(req, res) {
    // 解析URL以獲取路徑名
    var url = parse(req.url);
    // 構造絕對路徑
    var path = join(root, url.pathname);
    // 檢查文件是否存在
    fs.stat(path, function(err, stat) {
        if(err) {
            if('ENOENT' == err.code) { // 文件不存在
                res.statusCode = 404;
                res.end('Not Found');
            }
            else { // 其他錯誤
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        }
        else
        {
            // 用stat對象的屬性設置Content-Length
            res.setHeader('Content-Length', stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function(err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });    
});

server.listen(3000);