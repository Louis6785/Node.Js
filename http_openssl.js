var https = require('https');
var fs = require('fs');

var options = {
    // 做為配置項的SSL私鑰跟證書
    key: fs.readFileSync('./.ssh/key.pem'),
    cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, function(req, res) {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(3000);