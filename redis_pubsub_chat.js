var net = require('net');
var redis = require('redis');

// 為每個連接到聊天服務器上的用戶定義設置邏輯
var server = net.createServer(function(socket) {
    var subscriber;
    var publisher;

    socket.on('connect', function() {
        // 為用戶創建預定客戶端
        subscriber = redis.createClient();
        // 預定頻道
        subscriber.subscribe('main_chat_room');
        // 頻道收到消息後，把它發給用戶
        socket.on('message', function(channel, message) {
            socket.write('Channel ' + channel + ':' + message);
        });
        // 為用戶創建發布客戶端
        publisher = redis.createClient();
    });

    // 用戶輸入消息後發布它
    socket.on('data', function(data) {
        publisher.publish('main_chat_room', data);
    });

    // 如果用戶斷開連結，終止客戶端連結
    socket.on('end', function() {
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    });
});
// 啟動聊天服務器
server.listen(3000);