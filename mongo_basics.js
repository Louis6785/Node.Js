// 連接MongoDB
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, {w:1});

// 訪問MongoDB集合
client.open(function(err) {
    if(err) throw err;
    client.collection('test_insert', function(err, collection) {
        if(err) throw err;
        console.log('We are now able to perform queries.');

        // 將文檔插入集合中
        collection.insert({
            "title": "I like cake",
            "body": "It is quite good."
        }, 
        {safe: true}, // 安全模式表明數據庫操作應該在回調執行之前完成
        function(err, documents) {
            if(err) throw err;
            console.log('Document ID is: ' + document[0]._id);
        });

        // 更新MongoDB文檔
        var _id = new client.bson_serializer.ObjectID('4e650d344ac74b5a01000001');
        collection.update(
            {_id: _id},
            {$set: {"title": "T ate too much cake"}},
            {safe: true},
            function(err) {
                if(err) throw err;
            }
        );

        // 搜索文檔
        collection.find({"title": "I like cake"}).toArray(function(err, results) {
            if(err) throw err;
            console.log(results);
        });

        // 刪除文檔
        var _id = new client.bson_serializer.ObjectID('4e6513f0730d319501000001');
        collection.remove({_id: _id}, {safe: true}, function(err) {
            if(err) throw err;
        });
    });
});