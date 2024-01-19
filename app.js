const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static('public'));

// Database connection
function connectToDatabase() {
    return new sqlite3.Database('score.db');
}

// Error handling
function handleError(err, res) {
    if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        return true;
    }
    return false;
}

// Routes
app.get('/getJsonData', (req, res) => {
    const db = connectToDatabase();
    const sql = `
        SELECT username, SUM(score_change) AS total_score
        FROM score_changes
        GROUP BY username;
    `;

    db.all(sql, [], (err, rows) => {
        if (handleError(err, res)) {
            db.close();
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

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/userList', (req, res) => {
    const db = connectToDatabase();
    const sql = 'SELECT username FROM users';

    db.all(sql, [], (err, rows) => {
        if (handleError(err, res)) {
            db.close();
            return;
        }

        const userList = rows.map(row => row.username);
        res.json(userList);
        db.close();
    });
});

app.get('/user/:username', (req, res) => {
    const { username } = req.params;
    const db = connectToDatabase();
    const sql = `
        SELECT *
        FROM score_changes
        WHERE username = ?;
    `;

    db.all(sql, [username], (err, rows) => {
        if (handleError(err, res)) {
            db.close();
            return;
        }

        res.json(rows);
        db.close();
    });
});

app.post("/insertScoreChange", (req, res) => {
    const db = connectToDatabase();
    const { username, reason, scoreChange } = req.body;
    const insert_sql = "INSERT INTO score_changes (username , reason, score_change) VALUES (?, ?, ?)";
    
    db.run(insert_sql, [username, reason, scoreChange], function (err) {
        if (handleError(err, res)) {
            db.close();
            return;
        }

        db.close();
        console.log(username, reason, scoreChange, "inserted");

        return res.status(200).json({ message: 'Score change inserted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
