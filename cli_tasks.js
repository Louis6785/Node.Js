var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); // 去掉"node cli_tasks.js"，只留下參數
var command = args.shift(); // 取出第一個參數
var taskDescription = args.join(' ');   // 合併剩餘的參數
var file = path.join(process.cwd(), '/.tasks'); // 根據當前的工作目錄解析數據庫的相對路徑

switch(command) {
    case 'list':
        // 'list'會列出所有已保存的任務
        listTasks(file);    
        break;
    case 'add':
        // 'add'會添加新任務
        addTask(file, taskDescription);    
        break;
    default:
        // 其他任何參數都會顯示幫助
        console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]');
}

// 從文本文件中加載用JSON編碼的數據
function loadOrInitializeTaskArray(file, cb) {
    // 檢查.tasks文件是否已經存在
    fs.exists(file, function(exists) {
        var tasks = [];
        if(exists) {
            // 從.tasks文件中讀取待辦事項數據
            fs.readFile(file, 'utf8', function(err, data) {
                if(err) throw err;
                var data = data.toString();
                // 把用JSON編碼的待辦事項數據解析到任務數組中
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            });
        }
        else
        {
            // 如果.task文件不存在，則創建空的任務數組
            cb([]);
        }
    });
}

// 列出任務的函數
function listTasks(file) {
    loadOrInitializeTaskArray(file, function(tasks) {
        for(var i in tasks) {
            console.log(tasks[i]);
        }
    });
}

// 把任務保存到磁盤中
function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
        if(err) throw err;
        console.log('Saved.');
    });
}

// 添加一項任務
function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function(tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}