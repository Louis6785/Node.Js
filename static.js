var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;
var server = http.createServer(function(req, res) {
    var url = parse(req.url);
    // 構造絕對路徑
    var path = join(root, url.pathname);
    // 創建fs.ReadStream
    var stream = fs.createReadStream(path);
    // 將文件數據寫到响應中
    stream.on('data', function(chunk) {
        res.write(chunk);
    });
    stream.on('end', function() {
        // 文件寫完後結束响應
        res.end();
    });

});

server.listen(3000);