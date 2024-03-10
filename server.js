const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/src', express.static(path.join(__dirname, 'src')));

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server is running on http://127.0.0.1:${PORT}`);
});