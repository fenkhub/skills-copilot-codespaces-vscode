// Create web server
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', (req, res) => {
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/comments', (req, res) => {
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const comments = JSON.parse(data);
        const newComment = {
                        id: uuidv4(),
                        text: req.body.text,
                        author: req.body.author,
                        timestamp: new Date()
                    };
                    comments.push(newComment);
                    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), (err) => {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        res.json(newComment);
                    });
                });
            });