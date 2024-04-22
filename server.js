const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const options = {
 key: fs.readFileSync('../Personal/key.pem'),
 passphrase: 'exg0rd',
 cert: fs.readFileSync('../Personal/cert.pem')
};

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;

// Create an HTTPS service using the options and the Express app
https.createServer(options, app).listen(PORT, () => {
 console.log(`Server started on port ` + PORT);
});
