const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// 檔案路徑
const filePath = 'usernames.txt';

let users;  // 將 users 移到 try 塊之外

// 使用 fs 模組同步讀取檔案內容
try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // 將檔案內容轉換為陣列（假設每行一個用戶名）
    users = fileContent.split('\n').map(user => user.trim());

    console.log('Users from file:', users);
} catch (err) {
    console.error('Error reading file:', err);
}

// 開啟數據庫連接
const db = new sqlite3.Database('score.db');

// 初始化 users 表格和 score_changes 表格
db.serialize(() => {
    // 創建 users 表格
    const createUserTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY
        );
    `;
    db.run(createUserTableSql, err => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });

    // 創建 score_changes 表格
    const createScoreChangesTableSql = `
        CREATE TABLE IF NOT EXISTS score_changes (
            change_id INTEGER PRIMARY KEY,
            username TEXT,
            reason TEXT NOT NULL,
            score_change INTEGER NOT NULL,
            change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES users(username)
        );
    `;
    db.run(createScoreChangesTableSql, err => {
        if (err) {
            console.error('Error creating score_changes table:', err);
        } else {
            console.log('Score_changes table created successfully');
        }

        // 初始化用戶和分數變更數據
        const insertUserSql = 'INSERT INTO users (username) VALUES (?)';
        const insertScoreChangeSql = 'INSERT INTO score_changes (username, reason, score_change) VALUES (?, ?, ?)';

        users.forEach(user => {
            db.run(insertUserSql, [user], function(err) {
                if (err) {
                    console.error('Error inserting user:', err);
                } else {
                    console.log(`User ${user} inserted successfully with ID: ${this.lastID}`);
                }
            });
        });

        users.forEach(user => {
            db.run(insertScoreChangeSql, [user, '初始分數', 100], function(err) {
                if (err) {
                    console.error('Error inserting score change:', err);
                } else {
                    console.log(`Score change for ${user} inserted successfully with ID: ${this.lastID}`);
                }
            });
        });

        // 關閉數據庫連接，確保在所有操作完成後執行
        db.close();
    });
});
