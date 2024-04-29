const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;

http.createServer(app).listen(PORT, () => {
 console.log(`Server started on port ` + PORT);
});
