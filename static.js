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
    // res.end()會在stream.pipe()內部調用
    stream.pipe(res);
});

server.listen(3000);