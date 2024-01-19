const express = require('express');
const path = require('path'); // 引入 path 模組
const sqlite3 = require('sqlite3').verbose(); // Database
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/getJsonData', (req, res) => {
    const db = new sqlite3.Database('score.db');

    const sql = `
        SELECT username, SUM(score_change) AS total_score
        FROM score_changes
        GROUP BY username;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            db.close();
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const result = rows.reduce((acc, row) => {
            acc[row.username] = row.total_score;
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

        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(rows);
        db.close();
    });
});

app.post("/insertScoreChange", (req, res) => {
    const db = new sqlite3.Database('score.db');
    const { username, reason, scoreChange } = req.body;
    console.log(username, reason, scoreChange)
    const insert_sql = "INSERT INTO score_changes (username , reason, score_change) VALUES (?, ?, ?)";
    
    db.run(insert_sql, [username, reason, scoreChange], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.close();
        console.log(username, reason, scoreChange, "inserted"); // 在這裡打印

        return res.status(200).json({ message: 'Score change inserted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

