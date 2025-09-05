const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const DATA_PATH = path.join(__dirname, 'data.json');

function readUsers() {
    if (!fs.existsSync(DATA_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch {
        return [];
    }
}
function writeUsers(users) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    let users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ error: 'Username already exists' });
    }
    users.push({ username, password });
    writeUsers(users);
    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    if (users.find(u => u.username === username && u.password === password)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
