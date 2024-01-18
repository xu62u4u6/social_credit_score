const express = require('express');
const path = require('path'); // 引入 path 模組
const sqlite3 = require('sqlite3').verbose(); // Database
const app = express();
const port = 4000;


// Serve static files (e.g., your HTML page)
app.use(express.static('public'));

const db = new sqlite3.Database('score.db');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/getJsonData', (req, res) => {
    // get data from db
    res.json(jsonData);
});

app.get("/insertScoreChange", (req, res) => {
    // 假設你的請求參數中包含需要的信息，這裡使用 req.query
    const { username, reason, score_change } = req.query;
    const insert_sql = "INSERT INTO score_changes (username, reason, score_change) VALUES (?, ?, ?)";
    console.log(req);
    // 使用 prepared statement 防止 SQL 注入
    db.run(insert_sql, [username, reason, score_change], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 插入成功，現在可以關閉數據庫連接
        db.close();

        return res.status(200).json({ message: 'Score change inserted successfully' });
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
