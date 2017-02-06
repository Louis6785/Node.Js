var parse = require('url').parse;

module.exports = function route(obj) {
    return function(req, res, next) {
        // 檢查以確保req.method定義了
        if(!obj[req.method]) {
            // 如果未定義，調用next()，並停止一切後續操作
            next();
            return;
        }
        // 查找req.method對應的路徑
        var routes = obj[req.method];
        // 解析URL以便跟pathname匹配
        var url = parse(req.url);
        // 將req.method對應的路徑存放到數組中
        var paths = object.keys(routes);

        // 遍歷路徑
        for(var i = 0 ; i < paths.length ; i++) {
            var path = paths[i];
            var fn = routes[path];
            path = path
                .replace(/\//g,'\\/')
                .replace(/:(\w+)/g,'([^\\/]+)');
            // 構造正則表達式
            var re = new RegExp('^' + path + '$');
            var captures = url.pathname.match(re);
            // 嘗試跟pathname匹配
            if(captures) {
                // 傳遞被捕穫的分組
                var args = [req, res].concat(captures.slice(1));
                fn.apply(null, args);
                // 當有相匹配的函數時，返回，以防止後續的next()調用
                return;
            }
        }
        next();
    }
};