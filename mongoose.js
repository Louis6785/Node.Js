// 連接Mongoose
var mongoose = require('mongoose');
var db = mongoose.connect('mongoose://localhost/tasks');

// 註冊schema
var Schema = mongoose.Schema;
var Tasks = new Schema({
    project: String,
    description: String
});
mongoose.model('Task', Tasks);

// 添加任務
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
    if(err) throw err;
    console.log('Task saved.');
});

// 搜索文檔
var Task = mongoose.model('Task');
Task.find({'project': 'Bikeshed'}, function(err, tasks) {
    for(var i = 0 ; i < tasks.length ; i++) {
        console.log('ID:' + tasks[i]._id);
        console.log(tasks[i].description);
    }
});

// 更新文檔
var Task = mongoose.model('Task');
Task.update(
    {_id: '4e65b793d0cf5ca508000001'}, // 用內部ID更新
    {description: 'Paint the bikeshed green.'},
    {multi: false}, // 只更新一個文檔
    function(err, rows_updated) {
        if(err) throw err;
        console.log('UPdated.');
    }
);

// 刪除文檔
var Task = mongoose.model('Task');
Task.findById('4e65b793d0cf5ca508000001', function(err, task) {
    task.remove();
});

// 關閉Mongoose
mongoose.disconnect();