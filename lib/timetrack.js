var qs = require('querystring');

// 發送HTML响應
exports.sendHtml = function(res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

// 解析HTTP POST 數據
exports.parseReceivedData = function(req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    });
}

// 渲染簡單的表單
exports.actionForm = function(id, path, label) {
    var html = '<form mrthod="POST" action="' + path + '">'
            + '<input type="hidden" name="id" value="' + id + '" />'
            + '<input type="submit" value="' + label + '" />'
            + '</form>';

    return html;
}

// 添加工作記錄
exports.add = function(db, req, res) {
    // 解析HTTP POST數據
    exports.parseReceivedData(req, function(work) {
        // 添加工作記錄的SQL
        db.query(
            "INSERT INTO work(hours, date, description) "
            + "VALUES(?,?,?)",
            [work.hours, work.date,work.description],   // 工作記錄數據
            function(err) {
                if(err) throw err;
                // 給用戶顯示工作記錄清單
                exports.show(db, res);
            }
        );
    });
}

// 刪除工作記錄
exports.delete = function(db, req, res) {
    // 解析HTTP POST數據
    exports.parseReceivedData(req, function(work) {
        // 刪除工作記錄的SQL
        db.query(
            "DELETE FROM work WHERE id=?",
            [work.id],  // 工作記錄ID
            function(err) {
                if(err) throw err;
                // 給用戶顯示工作記錄清單
                exports.show(db, res);
            }
        );
    });
}

// 歸檔一條工作記錄
exports.archive = function(db, req, res) {
    // 解析HTTP POST數據
    exports.parseReceivedData(req, function(work) {
        // 更新工作記錄的SQL
        db.query(
            "UPDATE work SET archived=1 WHERE id=?",
            [work.id],  // 工作記錄ID
            function(err) {
                if(err) throw err;
                // 給用戶顯示工作記錄清單
                exports.show(db, res);
            }
        );
    });
}

// 獲取工作記錄
exports.show = function(db, res, showArchived) {
    // 獲取工作記錄的SQL
    var query = "SELECT * FROM work "
            + "WHERE archived=? "
            + "ORDER BY date DESC";

    var archiveValue = (showArchived) ? 1: 0;
    db.query(
        query,
        [archiveValue], // 想要的工作記錄歸檔狀態
        function(err, rows) {
            if(err) throw err;
            html = (showArchived) ? '' : '<a href="/archived">Archived Work</a></br />';
            html += expors.workHitlistHtml(rows);   // 將結果格式化HTML表格
            html += exports.workFormHtml();
            exports.sendHtml(res, html);    // 給用戶發送HTML响應
        }
    );
}

// 只顯示歸檔的工作記錄
exports.showArchived = function(db, res) {
    exports.show(db, res, true);
}

// 將工作記錄渲染為HTML表格
expors.workHitlistHtml = function(rows) {
    var html = '<table>';
    // 將每條工作記錄渲染為HTML表格中的一行
    for(var i in rows) {
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        // 如果工作記錄還沒歸檔，顯示歸檔按鈕
        if(!rows[i].archived) {
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
        }
        html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

// 渲染用來輸入新工作記錄的空白HTML表單
exports.workFormHtml = function() {
    var html = '<form method="POST" action="/">'
            + '<p>Date (YYYY-MM-DD):<br /><input name="date" type="text" /></p>'
            + '<p>Hours worked:<br /><input name="hours" type="text" /></p>'
            + '<p>Description:<br />'
            + '<textarea name="description"></textarea></p>' 
            + '<input type="submit" value="Add" />'
            + '</form>';
    return html;
}

// 渲染歸檔按鈕表單
exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Archive');
}

// 渲染刪除按鈕表單
exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
}