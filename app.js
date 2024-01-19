const express = require('express');
const path = require('path'); // 引入 path 模組
const sqlite3 = require('sqlite3').verbose(); // Database
const app = express();
const port = 4000;

app.get('/getJsonData', (req, res) => {
    const db = new sqlite3.Database('score.db');

    const sql = `
        SELECT user_name, SUM(score_change) AS total_score
        FROM score_changes
        GROUP BY user_name;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            db.close();
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const result = rows.reduce((acc, row) => {
            acc[row.user_name] = row.total_score;
            return acc;
        }, {});

        res.json(result);
        db.close();
    });
});


// Serve static files (e.g., your HTML page)
app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/userList', (req, res) => {
    const db = new sqlite3.Database('score.db'); 
    const sql = 'SELECT username FROM users';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).json({ error: 'Error querying users' });
        }
        const userList = rows.map(row => row.username);
    res.json(userList);

        // 關閉資料庫連接
        db.close();
    });
});

app.get('/user/:username', (req, res) => {
    const { username } = req.params;

    const db = new sqlite3.Database('score.db');
    const sql = `
        SELECT *
        FROM score_changes
        WHERE username = ?;
    `;

    db.all(sql, [username], (err, rows) => {
        db.close();

        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(rows);
    });
});

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

