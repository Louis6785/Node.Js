// 可配置的Connect中間件組件logger
// setup函數可以用不同的配置調用多次
function setup(format) {
    // logger組件用正則表達式匹配請求屬性
    var regexp = /:(\w+)/g;
    // Connect使用的真實logger組件
    return function logger(req, res, next) {
        // 用正則表達式格式化請求的日誌條目
        var str = format.replace(regexp, function(match, property) {
            return req[property];
        });
        // 將日誌條目輸出到控制台
        console.log(str);
        // 將控制權交給下一個中間件組件
        next();
    }
}

// 直接導出logger的setup函數
module.exports = setup;