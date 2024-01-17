CREATE TABLE users (
    username TEXT PRIMARY KEY
);

CREATE TABLE score_changes (
    change_id INTEGER PRIMARY KEY,
    username TEXT,
    reason TEXT NOT NULL,
    score_change INTEGER NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username)
);
